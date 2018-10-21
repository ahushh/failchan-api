import { Service, Inject } from 'typedi';
import { Attachment } from '../../domain/entity/attachment';
import { IFileServiceFactory, FileServiceFactory } from '../../infra/file/file.factory';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Post } from '../../domain/entity/post';
import { IFileService } from '../../infra/file/file.interface';

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
    @TransactionRepository(Attachment) public transactionRepo: Repository<Attachment>,
    @InjectRepository(Post) public postRepo: Repository<Post>,
  ) { }
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

    const [uri, thumbnailUri, exif] = await Promise.all([
      service.upload(file.path, file.originalname),
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
    return this.transactionRepo.save(attachment);
  }

  @Transaction()
  async createMultiple (files: IAttachmentFile[]) {
    const created = await Promise.all(files.map(this.createOne));
    return created.map(({ id }) => id);
  }

  // attachToPost = async (ids: number[], postId: number): Promise<Post> => {
  //   const attachments = await this.repo.findByIds(ids);
  //   const post = await this.postRepo.findOneOrFail(postId);
  //   attachments.forEach(a => a.post = post);
  //   const updatedAttachments = await this.repo.save(attachments);
  //   post.attachments = updatedAttachments;
  //   return this.postRepo.save(post);
  // }
}
