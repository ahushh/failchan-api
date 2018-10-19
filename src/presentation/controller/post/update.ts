import { Request, Response } from 'express';
import { Container } from 'typedi';
import { PostService } from '../../../app/service/post.service';
import { IUpdatePostCommand } from '../../../app/commands/post';

export async function postsUpdateAction(request: Request, response: Response, next: Function) {
  const postId = request.params.postId;
  const command: IUpdatePostCommand = request.body.post;
  const service         = Container.get(PostService);
  try {
    const post = await service.update(postId, command);
    response.json({ post });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      response.status(404).json({ message: `Post ${postId} not found` });
    }
    next(e);
  }
}
