
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../config/type';
import { Board } from '../../domain/entity/board';
import { IBoardService } from '../../domain/interfaces/board.service';
import { BoardRepository } from '../../infra/repository/board.repo';
import { BOARD_ERRORS } from '../errors/board';

@provide(IOC_TYPE.BoardService)
export class BoardService implements IBoardService {
  constructor(
    @inject(IOC_TYPE.BoardRepository) private repo: BoardRepository,
  ) { }
  async create({ slug, name }): Promise<Board> {
    const board = Board.create(slug, name);

    try {
      return await this.repo.save(board);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) {
        const error = new Error(BOARD_ERRORS.ALREADY_EXISTS);
        error.name = 'AlreadyExists';
        throw error;
      }
      throw e;
    }
  }
  list(): Promise<Board[]> {
    return this.repo.find();
  }
  // getThreads(boardId: string): Promise<Thread[]> {
  //   return this.repo.getBoardWithThreads(boardId)
  // }
}
