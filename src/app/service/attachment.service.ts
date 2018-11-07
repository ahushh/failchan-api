import { Redis } from 'ioredis';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import uuidv4 from 'uuid/v4';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { FileServiceFactory, IFileServiceFactory } from '../../infra/services/file/file.factory';
import { IFileService } from '../../infra/services/file/file.interface';
import { ExpiredAttachmentService } from '../listeners/expired-attachments';

export interface IAttachmentFile {
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}

@Service()
export class AttachmentService {
  constructor(
    @Inject(FileServiceFactory) public factory: IFileServiceFactory,
    @InjectRepository(Attachment) public repo: Repository<Attachment>,
    @InjectRepository(Post) public postRepo: Repository<Post>,
    @Inject('redis-connection') public redis: Redis,
    @Inject(type => ExpiredAttachmentService) public expiredAttachment: ExpiredAttachmentService,
  ) {
  }
  static generateStorageKey(md5: string, originalname: string): string {
    return `${md5}/${originalname}`;
  }

  async createFromCache(id: string): Promise<number[]> {
    const files = await this.getFromCache(id);
    return this.createMultiple(files);
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
      const service: IFileService = this.factory.create(a.mime);
      const storageKey = AttachmentService.generateStorageKey(a.md5, a.name);
      await service.delete(storageKey);
      await service.deleteThumbnail(a.md5);
    };
    await Promise.all(attachments.map(deleteAttachment));
    await this.repo.delete(ids);
  }

  private calcHash = async (file: IAttachmentFile): Promise<string> => {
    const service = this.factory.create(file.mimetype);
    return service.calculateMd5(file.path);
  }

  private getExistingByMd5 = (md5: string) => {
    return this.repo.findOne({ where: { md5 } });
  }

  private getFileMetadata = async (file: IAttachmentFile) => {
    const service: IFileService = this.factory.create(file.mimetype);
    const md5 = await this.calcHash(file);

    const existing = await this.getExistingByMd5(md5);
    if (existing) {
      return {
        md5,
        uri: existing.uri,
        thumbnailUri: existing.thumbnailUri,
        exif: existing.exif,
      };
    }
    const storageKey = AttachmentService.generateStorageKey(md5, file.originalname);
    const [uri, thumbnailUri, exif] = await Promise.all([
      service.upload(file.path, storageKey),
      service.generateThumbnail(file.path, md5),
      service.getExif(file.path),
    ]);
    return { uri, thumbnailUri, exif, md5 };
  }

  private createOne = async (file: IAttachmentFile): Promise<Attachment> => {
    const { uri, thumbnailUri, exif, md5 } = await this.getFileMetadata(file);
    const attachment = Attachment.create(
      exif, md5, file.mimetype, file.originalname, thumbnailUri, uri, file.size,
    );
    return this.repo.save(attachment);
  }

  private async createMultiple(files: IAttachmentFile[]): Promise<number[]> {
    return await Promise.all(files.map(this.createOne)).then((created) => {
      return created.map(({ id }) => id);
    });
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
