import sharp from 'sharp';
import { IFile } from '../../../app/interfaces/file';
import { GenericFile } from './generic';

export class ImageFile extends GenericFile implements IFile {
  async generateThumbnail(size = 200): Promise<void> {
    this.thumbnail = await sharp(this.path)
      .resize(size)
      .toBuffer()
      .then((data: Buffer) => data);
  }
}
