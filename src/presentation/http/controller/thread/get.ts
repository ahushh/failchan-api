import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../../app/service/thread.service';

export async function threadsGetAction(request: Request, response: Response) {
  const service = Container.get(ThreadService);
  const thread = await service.getThreadWithPosts(+request.params.threadId);
  response.json({ thread });
}
