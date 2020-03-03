import fs from 'fs';
import { promisify } from 'util';

import exiftoolBin from 'dist-exiftool';
import md5 from 'md5';
import exiftool from 'node-exiftool';
import R from 'ramda';

import { IFile } from '../../../app/interfaces/file';
import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';

export class GenericFile implements IFile {
  path: string;
  name: string;
  mime: string;
  size: number;

  thumbnail: Buffer | null;

  // metadata
  md5: string;
  protected exif: any;
  uri: string;
  thumbnailUri: string;

  constructor(file: IAttachmentFile) {
    this.path = file.path;
    this.name = file.originalname;
    this.mime = file.mimetype;
    this.size = file.size;
  }
  get storageKey() {
    return `${this.md5}/${this.name}`;
  }

  get thumbnailStorageKey() {
    return `${this.md5}/t${this.name}`;
  }

  async getExif(): Promise<void> {
    const ep = new exiftool.ExiftoolProcess(exiftoolBin);
    this.exif = await ep.open()
      .then(() => ep.readMetadata(this.path, ['-File:all']))
      .then(R.prop('data'))
      .then(R.head)
      .then(R.omit(['SourceFile']))
      .catch(() => ep.close());
  }
  async calculateMd5(): Promise<void> {
    const buff = await promisify(fs.readFile)(this.path);
    this.md5 = md5(buff);
  }
  generateThumbnail(size = 200) {
    return Promise.resolve<void>(void (0));
  }
  toJSON() {
    return {
      exif: this.exif,
      md5: this.md5,
      uri: this.uri,
      thumbnailUri: this.thumbnailUri,
      mime: this.mime,
      originalName: this.name,
      size: this.size,
    };
  }
}
