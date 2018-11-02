import { Request, Response } from 'express';
import { Container } from 'typedi';
import { BoardService } from '../../../../app/service/board.service';

export async function boardsListAction(request: Request, response: Response) {
  const service = Container.get(BoardService);
  const boards = await service.list();
  response.json({ boards });
}
