import sharp from 'sharp';
import { IFile } from './file.interface';
import { GenericFile } from './generic';

export class ImageFile extends GenericFile implements IFile {
  async generateThumbnail(): Promise<void> {
    const size: number = Number(process.env.THUMBNAIL_SIZE) || 200;
    this.thumbnail = await sharp(this.path)
      .resize(size)
      .toBuffer()
      .then((data: Buffer) => data);
  }
}
