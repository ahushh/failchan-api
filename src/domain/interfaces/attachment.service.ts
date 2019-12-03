import { IAttachmentFile } from './attachment-file';

export interface IAttachmentService {
  createFromCache(id: string): Promise<number[]>;

  saveToCache(files: IAttachmentFile[]);

  delete(ids: number[]): void;
}
