import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ICreatePostCommand } from '../../../app/commands/post';
import { PostService } from '../../../app/service/post.service';

export async function postsCreateAction(request: Request, response: Response, next: Function) {
  const threadId        = request.params.threadId;
  const command: ICreatePostCommand = request.body.post;
  const service         = Container.get(PostService);
  try {
    const createdPost     = await service.replyToThread(threadId, command);
    response.json({ post: createdPost });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      response.status(404).json({ message: `Thread ${request.params.threadId} not found` });
    }
    next(e);
  }
}
