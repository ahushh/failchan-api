import { Request, Response } from 'express';
import { Thread } from '../../entity/thread';
import typedi, { Container } from 'typedi';
import { ThreadService } from '../../service/thread.service';

export async function threadsCreateAction(request: Request, response: Response) {
  const service = Container.get(ThreadService);
  const thread = await service.create(request.params.boardSlug, request.body.post);
  response.json({ thread });
}
