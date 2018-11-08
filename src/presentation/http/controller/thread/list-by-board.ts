import { Request, Response } from 'express';
import { ListThreadsByBoardAction } from '../../../../app/actions/thread/list';

export async function threadsListByBoardAction(request: Request, response: Response) {
  const threads = await new ListThreadsByBoardAction({
    boardSlug: request.params.boardSlug,
    skip: request.query.skip,
  }).execute();
  response.json({ threads });
}
