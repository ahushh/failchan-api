import Joi from '@hapi/joi';
import { Redis } from 'ioredis';
import uuidv4 from 'uuid/v4';
import { Attachment } from '../../domain/entity/attachment';

import { inject } from 'inversify';
import { fluentProvide, provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../config/type';
import { IAttachmentFile } from '../../domain/interfaces/attachment-file';
import { IAttachmentService } from '../../domain/interfaces/attachment.service';
import { IAuthorService } from '../../domain/interfaces/author.service';
import { AppErrorAttachmentCacheRecordNotFound } from '../errors/attachment';
import { validate } from '../errors/validate';
import { IAttachmentRepository } from '../interfaces/attachment.repo';
import { IFile } from '../interfaces/file';
import { IFileFactory } from '../interfaces/file.factory';
import { IFileRepository } from '../interfaces/file.repo';
import { ExpiredAttachmentService } from '../listeners/expired-attachments';
import { AppConfigService } from './app-config.service';

@fluentProvide(IOC_TYPE.AttachmentService).inSingletonScope().done(true)
export class AttachmentService implements IAttachmentService {
  constructor(
    // TODO: move interface declarations
    @inject(IOC_TYPE.FileFactory) public fileFactory: IFileFactory,
    @inject(IOC_TYPE.AttachmentRepository) public repo: IAttachmentRepository,
    // TODO: add interface for cache
    @inject(IOC_TYPE.RedisConnection) public redis: Redis,
    @inject(IOC_TYPE.ExpiredAttachmentService) public expiredAttachment: ExpiredAttachmentService,
    @inject(IOC_TYPE.FileRepository) public fileRepo: IFileRepository,
    @inject(IOC_TYPE.AppConfigService) public appConfig: AppConfigService,
    @inject(IOC_TYPE.AuthorService) public authorService: IAuthorService,
  ) {
    expiredAttachment.listen();
  }

  private getCacheKey(uid: string) {
    return `attachment:cache:${uid}`;
  }
  private getDataKey(uid: string) {
    return `attachment:data:${uid}`;
  }

  private getExpiresAt(): Date {
    const now = +new Date();
    return new Date(now + (1000 * this.appConfig.getConfig().ATTACHMENT_TTL));
  }

  private create = async (request: IAttachmentFile): Promise<Attachment> => {
    const file: IFile = this.fileFactory.create(request);
    await file.calculateMd5();
    await file.generateThumbnail(this.appConfig.getConfig().THUMBNAIL_SIZE);
    await file.getExif();
    await this.fileRepo.save(file);
    const json = await file.toJSON();
    return Attachment.create(json);
  }
  private async getFromCache(uid: string): Promise<IAttachmentFile[]> {
    const cacheKey = this.getCacheKey(uid);
    const dataKey = this.getDataKey(uid);
    const cacheEntry = await this.redis.get(cacheKey) as string;
    const dataEntry = await this.redis.get(dataKey) as string;
    if (cacheEntry === null || dataEntry === null) {
      throw new AppErrorAttachmentCacheRecordNotFound(uid);
    }
    try {
      return JSON.parse(dataEntry);
    } catch (e) {
      throw e;
    }
  }

  @validate(Joi.string().required())
  async createFromCache(id: string): Promise<number[]> {
    const files = await this.getFromCache(id);
    const entities = await Promise.all(files.map(f => this.create(f)));
    const saved = await this.repo.save(entities);
    return saved.map(({ id }) => id);
  }

  @validate(Joi.array().min(1).required())
  async saveToCache(files: IAttachmentFile[]) {
    const uid = uuidv4();
    const cacheKey = this.getCacheKey(uid);
    const dataKey = this.getDataKey(uid);
    const expiresAt = this.getExpiresAt();
    await this.redis.set(cacheKey, 1, 'EX', this.appConfig.getConfig().ATTACHMENT_TTL);
    await this.redis.set(dataKey, JSON.stringify(files));
    return { uid, expiresAt };
  }

  @validate(
    Joi.array().min(1).items(Joi.number()).required(),
    Joi.string().required(),
  )
  async delete(ids: number[], token: string) {
    const attachments = await this.repo.findByIds(ids, {
      relations: ['post', 'post.author'],
    });
    attachments.forEach(a => {
      this.authorService.checkAuthorshipByToken(token, a.post.author);
    });

    const deleteAttachment = (a: Attachment) =>
      this.fileRepo.delete([a.storageKey, a.thumbStorageKey].filter(Boolean));
    await Promise.all(attachments.map(deleteAttachment));
    await this.repo.delete(ids);
  }
}
