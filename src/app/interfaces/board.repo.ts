import { Board } from '../../domain/entity/board';

export interface IBoardRepository {
  getBySlug(slug: string): Promise<Board>;
  getFullBoard(boardId: number): Promise<Board>;
}
