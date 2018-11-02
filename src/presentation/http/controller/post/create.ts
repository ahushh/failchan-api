import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ReplyToThreadCommand } from '../../../../app/commands/post';
import { PostService } from '../../../../app/service/post.service';

export async function postsCreateAction(request: Request, response: Response, next: Function) {
  const threadId = request.params.threadId;
  const command  = new ReplyToThreadCommand({ ...request.body.post, threadId });
  const service  = Container.get(PostService);
  try {
    const createdPost = await service.replyToThreadHandler(command);
    response.json({ post: createdPost });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      response.status(404).json({ error: `Thread ${request.params.threadId} not found` });
    }
    next(e);
  }
}
