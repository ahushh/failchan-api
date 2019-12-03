import { Repository } from 'typeorm';
import { Board } from '../../domain/entity/board';

export interface IBoardRepository extends Repository<Board> {
  getBySlug(slug: string): Promise<Board>;
  getFullBoard(boardId: number): Promise<Board>;
}
