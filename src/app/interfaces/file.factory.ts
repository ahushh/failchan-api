import { IAttachmentFile } from '../../domain/interfaces/attachment-file';
import { IFile } from './file';
export interface IFileFactory {
  create(file: IAttachmentFile): IFile;
}
