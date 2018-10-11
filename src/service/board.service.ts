
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Board } from '../entity/board';
import { BoardRepository } from '../repository/board';
import { Thread } from '../entity/thread';

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
