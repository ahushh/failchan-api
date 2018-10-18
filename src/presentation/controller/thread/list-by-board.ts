import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';

export async function threadsListByBoardAction(request: Request, response: Response) {
  const take = 10;
  const offset = request.params.offset || 0;
  const service = Container.get(ThreadService);
  const threads = await service.getThreadsByBoardSlug(
    request.params.boardSlug, offset, take,
  );
  response.json({ threads });
}
