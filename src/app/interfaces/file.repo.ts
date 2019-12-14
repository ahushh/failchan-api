import { IFile } from './file';
export interface IFileRepository {
  save(file: IFile): Promise<IFile>;
  delete(keys: string[]): Promise<any>;
}
