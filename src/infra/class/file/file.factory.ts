import { Container, Service, Token } from 'typedi';
import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';
import { IFile } from './file.interface';
import { GenericFile } from './generic';
import { ImageFile } from './image';

export interface IFileFactory {
  create(file: IAttachmentFile): IFile;
}

// tslint:disable-next-line:variable-name
export const FileFactory = new Token<IFileFactory>();

@Service(FileFactory)
class Factory implements IFileFactory {
  create(file: IAttachmentFile): IFile {
    if (file.mimetype.match(/image\//)) {
      return new ImageFile(file);
    }
    return new GenericFile(file);
  }
}
