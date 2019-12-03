import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import uuidv4 from 'uuid/v4';
import { Attachment } from '../../domain/entity/attachment';

import { inject } from 'inversify';
import { fluentProvide, provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../config/type';
import { IAttachmentFile } from '../../domain/interfaces/attachment-file';
import { IAttachmentService } from '../../domain/interfaces/attachment.service';
import { IAttachmentRepository } from '../interfaces/attachment.repo';
import { IFile } from '../interfaces/file';
import { IFileFactory } from '../interfaces/file.factory';
import { IFileRepository } from '../interfaces/file.repo';
import { ExpiredAttachmentService } from '../listeners/expired-attachments';

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
  ) {
    expiredAttachment.listen();
  }

  private create = async (request: IAttachmentFile): Promise<Attachment> => {
    const file: IFile = this.fileFactory.create(request);
    await file.calculateMd5();
    await file.generateThumbnail();
    await file.getExif();
    await this.fileRepo.save(file);
    const json = await file.toJSON();
    return Attachment.create(json);
  }

  async createFromCache(id: string): Promise<number[]> {
    const files = await this.getFromCache(id);
    const entities = await Promise.all(files.map(f => this.create(f)));
    const saved = await this.repo.save(entities);
    return saved.map(({ id }) => id);
  }
  async saveToCache(files: IAttachmentFile[]) {
    const uid = uuidv4();
    const cacheKey = `attachment:cache:${uid}`;
    const dataKey = `attachment:data:${uid}`;
    await this.redis.set(cacheKey, 1, 'EX', process.env.ATTACHMENT_TTL);
    await this.redis.set(dataKey, JSON.stringify(files));
    return uid;
  }

  async delete(ids: number[]) {
    const attachments = await this.repo.findByIds(ids);
    const deleteAttachment = async (a: Attachment) => {
      await this.fileRepo.delete([a.storageKey, a.thumbStorageKey].filter(Boolean));
    };
    await Promise.all(attachments.map(deleteAttachment));
    await this.repo.delete(ids);
  }
  private async getFromCache(uid: string): Promise<IAttachmentFile[]> {
    const cacheKey = `attachment:cache:${uid}`;
    const dataKey = `attachment:data:${uid}`;
    const cacheEntry = await this.redis.get(cacheKey) as string;
    const dataEntry = await this.redis.get(dataKey) as string;
    if (cacheEntry === null || dataEntry === null) {
      const error = new Error(`File bunch ${uid} not found`);
      error.name = 'CacheRecordNotFound';
      throw error;
    }
    try {
      return JSON.parse(dataEntry);
    } catch (e) {
      throw e;
    }
  }
}
