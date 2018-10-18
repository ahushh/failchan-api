import { Service, Inject } from 'typedi';
import { Attachment } from '../../domain/entity/attachment';
import { IFileServiceFactory, FileServiceFactory } from '../../infra/file/file.factory';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Post } from '../../domain/entity/post';

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
  ) { }
  private calcHash = async (file: IAttachmentFile): Promise<string> => {
    const service = this.factory.create(file.mimetype);
    return service.calculateMd5(file.path);
  }

  private getExistingByMd5 = (md5: string) => {
    return this.repo.findOne({ where: { md5 } });
  }

  private getFileMetadata = async (file: IAttachmentFile) => {
    const service = this.factory.create(file.mimetype);
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
    const attachment = new Attachment();
    attachment.exif = exif;
    attachment.md5 = md5;
    attachment.mime = file.mimetype;
    attachment.name = file.originalname;
    attachment.thumbnailUri = thumbnailUri;
    attachment.uri = uri;
    attachment.size = `${file.size}`;
    return this.repo.save(attachment);
  }

  createMultiple = async (files: IAttachmentFile[]) => {
    const created = await Promise.all(files.map(this.createOne));
    return created.map(({ id }) => id);
  }

  attachToPost = async (ids: number[], postId: number): Promise<Post> => {
    const attachments = await this.repo.findByIds(ids);
    const post = await this.postRepo.findOneOrFail(postId);
    attachments.forEach(a => a.post = post);
    const updatedAttachments = await this.repo.save(attachments);
    post.attachments = updatedAttachments;
    return this.postRepo.save(post);
  }
}
