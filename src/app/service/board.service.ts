
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Board } from '../../domain/entity/board';
import { BoardRepository } from '../../infra/repository/board.repo';

@Service()
export class BoardService {
  constructor(@InjectRepository(Board) private repo: BoardRepository) {
    this.repo = repo;
  }
  create({ slug, name }): Promise<Board> {
    const board = new Board();
    board.slug = slug;
    board.name = name;
    return this.repo.save(board);
  }
  list(): Promise<Board[]> {
    return this.repo.find();
  }
  // getThreads(boardId: string): Promise<Thread[]> {
  //   return this.repo.getBoardWithThreads(boardId)
  // }
}
