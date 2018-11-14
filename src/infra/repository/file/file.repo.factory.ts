import { Service, Token } from 'typedi';
import { AWSFileRepository } from './aws.repo';
import { IFileRepository } from './file.repo.interface';
import { TestFileRepository } from './test.repo';

@Service()
export class FileRepositoryFactory {
  create(): IFileRepository {
    if (process.env.NODE_ENV === 'test') {
      return new TestFileRepository();
    }
    return new AWSFileRepository();
  }
}
