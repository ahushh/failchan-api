import { Request, Response } from 'express';
import { ListBoardAction } from '../../../../app/actions/board/list';

export async function boardsListAction(request: Request, response: Response) {
  const boards = await new ListBoardAction().execute();
  response.json({ boards });
}
