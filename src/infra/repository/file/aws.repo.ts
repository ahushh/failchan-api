import S3 from 'aws-sdk/clients/s3';
import { Blob } from 'aws-sdk/lib/dynamodb/document_client';
import fs from 'fs';
import * as R from 'ramda';
import { Readable } from 'stream';
import { IFile } from '../../../app/interfaces/file';
import { IFileRepository } from '../../../app/interfaces/file.repo';

export type Body = Buffer | Uint8Array | Blob | string | Readable;

interface IAwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export class AwsS3FileRepository implements IFileRepository {
  bucket: S3;

  constructor(config: IAwsConfig, private bucketName: string)  {
    this.bucket = new S3(
      R.pickAll(['accessKeyId', 'secretAccessKey', 'region'], config),
    );
  }

  async uploadBuffer(buffer: Body, key: string): Promise<string> {
    return await this.bucket.upload({
      Bucket: this.bucketName,
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
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map(k => ({ Key: k })),
        Quiet: false,
      },
    });
  }
}
