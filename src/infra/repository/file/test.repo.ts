import S3 from 'aws-sdk/clients/s3';
import { Blob } from 'aws-sdk/lib/dynamodb/document_client';
import fs from 'fs';
import { Readable } from 'stream';
import { IFile } from '../../class/file/file.interface';
import { IFileRepository } from './file.repo.interface';

export type Body = Buffer | Uint8Array | Blob | string | Readable;

export class TestFileRepository implements IFileRepository {

  constructor() {
  }

  async uploadBuffer(buffer: Body, key: string): Promise<string> {
    return Promise.resolve('some image url from buffer');
  }

  async save(file: IFile): Promise<IFile> {
    const rs = fs.createReadStream(file.path);
    file.uri = await this.uploadBuffer(rs, file.storageKey);
    if (file.thumbnail) {
      file.thumbnailUri = await this.uploadBuffer(file.thumbnail, file.md5);
    }
    return file;
  }

  async delete(keys: string[]): Promise<any> {
    return Promise.resolve();
  }
}
