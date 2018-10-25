import S3 from 'aws-sdk/clients/s3';
import { Blob } from 'aws-sdk/lib/dynamodb/document_client';
import fs, { ReadStream } from 'fs';
import { Readable } from 'stream';
import { Service } from 'typedi';

export type Body = Buffer | Uint8Array | Blob | string | Readable;

export interface IFileStorage {
  uploadFile(path: string, key: string): Promise<string>;
  uploadBuffer(buffer: Body, key: string): Promise<string>;
}

@Service()
export class FileStorage implements IFileStorage {
  bucket: S3;

  constructor() {
    this.bucket = new S3({
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      region: 'eu-central-1',
    });
  }

  async uploadBuffer(buffer: Body, key: string): Promise<string> {
    return await this.bucket.upload({
      Bucket: process.env.AWS_BUCKET as string,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
    }).promise().then((data) => {
      return data.Location;
    });
  }

  async uploadFile(path: string, key: string): Promise<string> {
    const rs = fs.createReadStream(path);
    return this.uploadBuffer(rs, key);
  }
}
