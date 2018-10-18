import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';

export async function threadsListByBoardAction(request: Request, response: Response) {
  const service = Container.get(ThreadService);
  const findOptions = {
    boardSlug: request.params.boardSlug,
    previewPosts: 5,
    take: 10,
    skip: request.params.skip || 0,
  };
  const threads = await service.getThreadsByBoardSlug(findOptions);
  response.json({ threads });
}
