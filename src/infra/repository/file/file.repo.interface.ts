import { IFile } from '../../class/file/file.interface';
export interface IFileRepository {
  save(file: IFile): Promise<IFile>;
  delete(keys: string[]): Promise<any>;
}
