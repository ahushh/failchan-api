import { Container, Service, Token } from 'typedi';
import { IFileService } from './file.interface';
import { GenericFileService } from './generic';
import { ImageFileService } from './image';

export interface IFileServiceFactory {
  create(mime: string): IFileService;
}

// tslint:disable-next-line:variable-name
export const FileServiceFactory = new Token<IFileServiceFactory>();

@Service(FileServiceFactory)
class Factory implements IFileServiceFactory {
  create(mime: string): IFileService {
    if (mime.match(/image\//)) {
      return Container.get(ImageFileService);
    }
    return Container.get(GenericFileService);
  }
}
