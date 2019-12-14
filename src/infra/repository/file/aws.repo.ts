import S3 from 'aws-sdk/clients/s3';
import { Blob } from 'aws-sdk/lib/dynamodb/document_client';
import fs from 'fs';
import { Readable } from 'stream';
import { IFile } from '../../../app/interfaces/file';
import { IFileRepository } from '../../../app/interfaces/file.repo';

export type Body = Buffer | Uint8Array | Blob | string | Readable;

export class AwsS3FileRepository implements IFileRepository {
  bucket: S3;

  constructor() {
    this.bucket = new S3({
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET,
      region: process.env.AWS_S3_REGION,
    });
  }

  async uploadBuffer(buffer: Body, key: string): Promise<string> {
    return await this.bucket.upload({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
    }).promise().then((data) => {
      return data.Location;
    });
  }

  /**
   * Saves file and its thumbnail to AWS S3
   * Fills in uri and thumbnail fields.
   * @param file IFile
   */
  async save(file: IFile): Promise<IFile> {
    const rs = fs.createReadStream(file.path);
    file.uri = await this.uploadBuffer(rs, file.storageKey);
    if (file.thumbnail) {
      file.thumbnailUri = await this.uploadBuffer(file.thumbnail, file.thumbnailStorageKey);
    }
    return file;
  }

  async delete(keys: string[]): Promise<any> {
    return await this.bucket.deleteObjects({
      Bucket: process.env.AWS_S3_BUCKET as string,
      Delete: {
        Objects: keys.map(k => ({ Key: k })),
        Quiet: false,
      },
    });
  }
}
