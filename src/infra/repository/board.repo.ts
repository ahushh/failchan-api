import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { IBoardRepository } from '../../app/interfaces/board.repo';
import { Board } from '../../domain/entity/board';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> implements IBoardRepository {
  constructor() {
    super();
  }
  getBySlug(slug: string): Promise<Board> {
    return this.findOneOrFail({ where: { slug } });
  }
  getFullBoard(boardId: number): Promise<Board> {
    return this.findOneOrFail({
      where: { id: boardId },
      relations: ['threads.posts'],
    });
  }
}
