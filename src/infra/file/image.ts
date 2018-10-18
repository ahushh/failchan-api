import sharp from 'sharp';
import { Service } from 'typedi';
import { IFileService } from './file.interface';
import { GenericFileService } from './generic';

@Service()
export class ImageFileService extends GenericFileService implements IFileService {
  generateThumbnail(path: string, filename: string): Promise<string> {
    const size: number = Number(process.env.THUMBNAIL_SIZE) || 200;
    return sharp(path)
      .resize(size)
      .toBuffer()
      .then((data: Buffer) => this.storage.uploadBuffer(data, filename));
  }
}
