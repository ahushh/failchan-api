import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ListThreadsByBoardCommand } from '../../../app/commands/thread';
import { ThreadService } from '../../../app/service/thread.service';

export async function threadsListByBoardAction(request: Request, response: Response) {
  const service = Container.get(ThreadService);
  const command = new ListThreadsByBoardCommand({
    boardSlug: request.params.boardSlug,
    skip: request.query.skip,
  });
  const threads = await service.listThreadsByBoardHandler(command);
  response.json({ threads });
}
