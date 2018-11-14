import { Service } from 'typedi';
import { FileRepositoryFactory } from './file.repo.factory';

@Service({ factory: [FileRepositoryFactory, 'create'] })
export class FileRepository {}
