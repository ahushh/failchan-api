import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import { IOC_TYPE } from '../../config/type';
import { Author } from '../../domain/entity/author';
import { IAuthorService } from '../../domain/interfaces/author.service';
import { AppErrorInvalidToken, AppErrorNotAuthorized } from '../errors/token';
import { IAuthorRepository } from '../interfaces/author.repo';

@provide(IOC_TYPE.AuthorService)
export class AuthorService implements IAuthorService {
  constructor(
    @inject(IOC_TYPE.AuthorRepository) private authorRepo: IAuthorRepository,
  ) { }

  async getAuthorByToken(token: string): Promise<{ author: Author; isNew: boolean; }> {
    let author;
    let isNew = false;
    if (token) {
      try {
        const { authorId } = Author.verifyToken(token);
        author = await this.authorRepo.findOneOrFail(authorId);
      } catch (e) {
        throw new AppErrorInvalidToken(e);
      }
    } else {
      const authorVO = new Author();
      author = await this.authorRepo.save(authorVO);
      isNew = true;
    }
    return { author, isNew };
  }

  checkAuthorshipByToken(token: string, author: Author) {
    let authorId;
    try {
      const data = Author.verifyToken(token);
      authorId = data.authorId;
    } catch (e) {
      throw new AppErrorInvalidToken(e);
    }
    if (authorId !== author.id) {
      throw new AppErrorNotAuthorized();
    }
  }
}
