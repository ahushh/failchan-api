import { Container, Service, Token, Inject } from 'typedi';
import { IFileService } from './file.interface';
import { ImageFileService } from './image';
import { GenericFileService } from './generic';
import { FileStorage } from '../storage.service';

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
