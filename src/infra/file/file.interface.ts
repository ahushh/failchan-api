export interface IFileService {
  getExif(path: string): Promise<Object>;
  calculateMd5(path: string): Promise<string>;
  generateThumbnail(path: string, filename: string): Promise<string>;
  upload(path: string, key: string): Promise<string>;
}
