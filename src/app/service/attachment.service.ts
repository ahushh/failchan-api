import { Inject, Service } from 'typedi';
import {
  Connection, EntityManager, Repository,
  Transaction, TransactionManager, TransactionRepository,
} from 'typeorm';
import { InjectConnection, InjectRepository } from 'typeorm-typedi-extensions';
import uuidv4 from 'uuid/v4';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { FileServiceFactory, IFileServiceFactory } from '../../infra/file/file.factory';
import { IFileService } from '../../infra/file/file.interface';
import { CHANNEL, EventBus } from './event-bus.service';

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
    @Inject(() => EventBus) public eventBus: EventBus,
  ) { }
  static generateStorageKey(md5: string, originalname: string): string {
    return `${md5}/${originalname}`;
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

  createMultiple(files: IAttachmentFile[]) {
    const uid = uuidv4();
    Promise.all(files.map(this.createOne)).then((created) => {
      const ids = created.map(({ id }) => id);
      this.eventBus.publish(`${CHANNEL.ATTACHMENTS_CREATED}:${uid}`, ids);
    });
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
}
