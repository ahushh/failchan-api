import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';
import { ListThreadsByBoardCommand } from '../../../app/commands/thread';

export async function threadsListByBoardAction(request: Request, response: Response) {
  const service = Container.get(ThreadService);
  const command = new ListThreadsByBoardCommand({
    boardSlug: request.params.boardSlug,
    skip: request.params.skip,
  });
  const threads = await service.getThreadsByBoardSlug(command);
  response.json({ threads });
}
