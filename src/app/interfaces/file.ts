import { INewAttachment } from '../../domain/entity/attachment';

export interface IFile {
  path: string;
  md5: string;
  uri: string;
  thumbnailUri: string;
  thumbnailStorageKey: string;
  storageKey: string;
  thumbnail: Buffer | null;
  name: string;
  mime: string;
  size: number;

  getExif(): Promise<void>;

  calculateMd5(): Promise<void>;
  generateThumbnail(size?: number): Promise<void>;
  toJSON(): INewAttachment;
}
