import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../config/type';
import { Board } from '../../domain/entity/board';
import { IAuthorService } from '../../domain/interfaces/author.service';
import { AppErrorBoardAlreadyExist } from '../errors/board';
import { IBoardRepository } from '../interfaces/board.repo';
import { AppErrorUnexpected } from '../errors/unexpected';
import { IAuthorRepository } from '../interfaces/author.repo';
import { Author } from '../../domain/entity/author';
import { AppErrorInvalidToken, AppErrorNotAuthorized } from '../errors/token';
import { Post } from '../../domain/entity/post';

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
    try {
        const { authorId } = Author.verifyToken(token);
        if (authorId !== author.id) {
            throw new AppErrorNotAuthorized();
        }
      } catch (e) {
        throw new AppErrorInvalidToken(e);
      }
  }
}
