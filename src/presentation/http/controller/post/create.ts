import { Request, Response } from 'express';
import { CreatePostAction } from '../../../../app/actions/post/create';

export async function postsCreateAction(request: Request, response: Response, next: Function) {
  const threadId = request.params.threadId;
  try {
    const post = await new CreatePostAction({
      threadId,
      ...request.body.post,
    }).execute();

    response.json({ post });
  } catch (e) {
    if (e.name === 'CacheRecordNotFound') {
      return response.status(400).json({ error: e.message });
    }
    if (e.name === 'EntityNotFound') {
      return response.status(404).json({ error: `Thread ${request.params.threadId} not found` });
    }
    next(e);
  }

}
