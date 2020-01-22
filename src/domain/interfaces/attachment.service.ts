import { IAttachmentFile } from './attachment-file';

export interface IAttachmentService {
  createFromCache(id: string): Promise<number[]>;

  saveToCache(files: IAttachmentFile[]): Promise<{ uid: string, expiresAt: Date }>;

  delete(ids: number[], token: string): void;
}
