import { Inject, Service } from 'typedi';
import { Attachment } from '../../domain/entity/attachment';
import { FileServiceFactory, IFileServiceFactory } from '../../infra/services/file/file.factory';
import { IFileService } from '../../infra/services/file/file.interface';
import { IAttachmentFile } from '../interfaces/attachment-file';

@Service()
export class DomainAttachmentService {
  constructor(
    @Inject(FileServiceFactory) public fileFactory: IFileServiceFactory,
  ) { }
  static generateStorageKey(md5: string, originalname: string): string {
    return `${md5}/${originalname}`;
  }

  private getFileMetadata = async (file: IAttachmentFile) => {
    const service: IFileService = this.fileFactory.create(file.mimetype);
    const md5 = await service.calculateMd5(file.path);
    const storageKey = DomainAttachmentService.generateStorageKey(md5, file.originalname);
    const [uri, thumbnailUri, exif] = await Promise.all([
      service.upload(file.path, storageKey),
      service.generateThumbnail(file.path, md5),
      service.getExif(file.path),
    ]);
    return { uri, thumbnailUri, exif, md5 };
  }

  async create(file: IAttachmentFile): Promise<Attachment> {
    const { uri, thumbnailUri, exif, md5 } = await this.getFileMetadata(file);
    return Attachment.create(
      exif, md5, file.mimetype, file.originalname, thumbnailUri, uri, file.size,
    );
  }
}
