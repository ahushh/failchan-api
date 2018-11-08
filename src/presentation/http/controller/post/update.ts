import { Request, Response } from 'express';
import { UpdatePostAction } from '../../../../app/actions/post/update';

export async function postsUpdateAction(request: Request, response: Response, next: Function) {
  const postId = request.params.postId;
  try {
    await new UpdatePostAction({ ...request.body.post, postId }).execute();
    response.sendStatus(204);
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      response.status(404).json({ message: `Post ${postId} not found` });
    }
    next(e);
  }
}
