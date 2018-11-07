export interface IFileService {
  getExif(path: string): Promise<Object>;
  calculateMd5(path: string): Promise<string>;
  generateThumbnail(path: string, filename: string): Promise<string>;
  deleteThumbnail(key: string): Promise<void>;
  upload(path: string, key: string): Promise<string>;
  delete(key: string): Promise<void>;

}
