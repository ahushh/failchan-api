import { provide } from 'inversify-binding-decorators';
import { IFile } from '../../../app/interfaces/file';
import { IFileFactory } from '../../../app/interfaces/file.factory';
import { IOC_TYPE } from '../../../config/type';
import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';
import { GenericFile } from './generic';
import { ImageFile } from './image';

@provide(IOC_TYPE.FileFactory)
export class FileFactory implements IFileFactory {
  create(file: IAttachmentFile): IFile {
    if (file.mimetype.match(/image\//)) {
      return new ImageFile(file);
    }
    return new GenericFile(file);
  }
}
