import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../service/thread.service';

export async function threadsListAction(request: Request, response: Response) {
  const boardId = request.context.models.Board.id;
  const service = Container.get(ThreadService);
  const threads = await service.getThreadsByBoardId(boardId);
  response.json({ threads });
}
