export interface IFile {
  path: string;
  md5: string;
  uri: string;
  thumbnailUri: string;
  storageKey: string;
  thumbnail: Buffer | null;
  name: string;
  mime: string;
  size: number;

  getExif(): Promise<void>;

  calculateMd5(): Promise<void>;
  generateThumbnail(): Promise<void>;
  toJSON(): {
    exif: string;
    md5: string;
    uri: string;
    thumbnailUri: string;
    mime: string;
    name: string;
    size: number;
  };
}