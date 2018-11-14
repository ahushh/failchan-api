import { Board } from '../entity/board';

export interface IBoardService {
  create(data: { slug: string; name: string }): Promise<Board>;
  list(): Promise<Board[]>;

}
