import { Request, Response } from 'express';
import { CreateThreadAction } from '../../../../app/actions/thread/create';

export async function threadsCreateAction(request: Request, response: Response, next: Function) {
  const boardSlug: string = request.params.boardSlug;
  try {
    const thread = await new CreateThreadAction({
      boardSlug,
      body: request.body.post.body,
      attachment: request.body.post.attachment,
      referencies: request.body.post.referencies,
      threadId: request.body.post.threadId,
    }).execute();
    response.json({ thread });
  } catch (e) {
    if (e.name === 'CacheRecordNotFound') {
      return response.status(400).json({ error: e.message });
    }
    if (e.name === 'EntityNotFound') {
      return response.status(404).json({ message: `Board ${boardSlug} not found` });
    }
    console.log(e);
    next(e);
  }
}
