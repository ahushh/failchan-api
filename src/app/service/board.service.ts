
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Board } from '../../domain/entity/board';
import { BoardRepository } from '../../infra/repository/board.repo';
import { BOARD_ERRORS } from '../errors/board';

@Service()
export class BoardService {
  constructor(@InjectRepository(Board) private repo: BoardRepository) { }
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
