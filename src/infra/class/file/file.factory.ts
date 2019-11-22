import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';
import { IFile } from './file.interface';
import { GenericFile } from './generic';
import { ImageFile } from './image';
import { IOC_TYPE } from '../../../config/type';
import { provide } from 'inversify-binding-decorators';

export interface IFileFactory {
  create(file: IAttachmentFile): IFile;
}

@provide(IOC_TYPE.FileFactory)
export class FileFactory implements IFileFactory {
  create(file: IAttachmentFile): IFile {
    if (file.mimetype.match(/image\//)) {
      return new ImageFile(file);
    }
    return new GenericFile(file);
  }
}
