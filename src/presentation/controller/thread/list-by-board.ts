import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';

export async function threadsListByBoardAction(request: Request, response: Response) {
  const service = Container.get(ThreadService);
  const threads = await service.getThreadsByBoardSlug(request.params.boardSlug);
  response.json({ threads });
}
