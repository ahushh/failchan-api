import { Redis } from 'ioredis';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import uuidv4 from 'uuid/v4';
import { Attachment } from '../../domain/entity/attachment';

import { IAttachmentFile } from '../../domain/interfaces/attachment-file';
import { DomainAttachmentService } from '../../domain/services/attachment.service';
import { FileServiceFactory, IFileServiceFactory } from '../../infra/services/file/file.factory';
import { IFileService } from '../../infra/services/file/file.interface';
import { ExpiredAttachmentService } from '../listeners/expired-attachments';

@Service()
export class AttachmentService {
  constructor(
    @Inject(FileServiceFactory) public factory: IFileServiceFactory,
    @InjectRepository(Attachment) public repo: Repository<Attachment>,
    @Inject('redis-connection') public redis: Redis,
    @Inject(type => ExpiredAttachmentService) public expiredAttachment: ExpiredAttachmentService,
    @Inject(type => DomainAttachmentService) public service: DomainAttachmentService,
  ) {
    expiredAttachment.listen();
  }

  async createFromCache(id: string): Promise<number[]> {
    const files = await this.getFromCache(id);
    const entities = await Promise.all(files.map(this.service.create));
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
      const fileService: IFileService = this.factory.create(a.mime);
      const storageKey = DomainAttachmentService.generateStorageKey(a.md5, a.name);
      await fileService.delete(storageKey);
      await fileService.deleteThumbnail(a.md5);
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
