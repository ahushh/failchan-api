import { Request, Response } from 'express';
import { Container } from 'typedi';
import { UpdatePostCommand } from '../../../../app/commands/post';
import { PostService } from '../../../../app/service/post.service';

export async function postsUpdateAction(request: Request, response: Response, next: Function) {
  const postId  = request.params.postId;
  const command = new UpdatePostCommand({ ...request.body.post, postId });
  const service = Container.get(PostService);
  try {
    await service.updatePostHandler(command);
    response.sendStatus(204);
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      response.status(404).json({ message: `Post ${postId} not found` });
    }
    next(e);
  }
}