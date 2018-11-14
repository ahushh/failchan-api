import { Redis } from 'ioredis';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import uuidv4 from 'uuid/v4';
import { Attachment } from '../../domain/entity/attachment';

import { IAttachmentFile } from '../../domain/interfaces/attachment-file';
import { FileFactory, IFileFactory } from '../../infra/class/file/file.factory';
import { IFile } from '../../infra/class/file/file.interface';
import { FileRepository } from '../../infra/repository/file/file.repo';
import { IFileRepository } from '../../infra/repository/file/file.repo.interface';
import { ExpiredAttachmentService } from '../listeners/expired-attachments';

@Service()
export class AttachmentService {
  constructor(
    @Inject(FileFactory) public factory: IFileFactory,
    @InjectRepository(Attachment) public repo: Repository<Attachment>,
    @Inject('redis-connection') public redis: Redis,
    @Inject(type => ExpiredAttachmentService) public expiredAttachment: ExpiredAttachmentService,
    @Inject(FileFactory) public fileFactory: IFileFactory,
    @Inject(type => FileRepository) public fileRepo: IFileRepository,
  ) {
    expiredAttachment.listen();
  }

  private create = async (request: IAttachmentFile): Promise<Attachment> => {
    const file: IFile = this.fileFactory.create(request);
    await file.calculateMd5();
    await file.generateThumbnail();
    await file.getExif();
    await this.fileRepo.save(file);
    const { uri, thumbnailUri, exif, md5, mime, name, size } = await file.toJSON();
    return Attachment.create(
      exif, md5, mime, name, thumbnailUri, uri, size,
    );
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
