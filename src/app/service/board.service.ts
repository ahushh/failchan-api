import Joi from '@hapi/joi';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import { IOC_TYPE } from '../../config/type';
import { Board } from '../../domain/entity/board';
import { IBoardService } from '../../domain/interfaces/board.service';
import { AppErrorBoardAlreadyExist } from '../errors/board';
import { AppErrorUnexpected } from '../errors/unexpected';
import { validate } from '../errors/validate';
import { IBoardRepository } from '../interfaces/board.repo';

@provide(IOC_TYPE.BoardService)
export class BoardService implements IBoardService {
  constructor(
    @inject(IOC_TYPE.BoardRepository) private repo: IBoardRepository,
  ) { }

  @validate(Joi.object({
    slug: Joi.string().required(),
    name: Joi.string().required(),
  }))
  async create({ slug, name }): Promise<Board> {
    const board = Board.create(slug, name);

    try {
      return await this.repo.save(board);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) {
        throw new AppErrorBoardAlreadyExist(e);
      }
      throw new AppErrorUnexpected(e);
    }
  }
  list(): Promise<Board[]> {
    return this.repo.find();
  }
  // getThreads(boardId: string): Promise<Thread[]> {
  //   return this.repo.getBoardWithThreads(boardId)
  // }
}
