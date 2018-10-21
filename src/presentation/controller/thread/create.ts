import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';
import { ReplyToThreadCommand } from '../../../app/commands/post';
import { PostService } from '../../../app/service/post.service';

export async function threadsCreateAction(request: Request, response: Response, next: Function) {
  const board = request.params.boardSlug;
  const service = Container.get(ThreadService);
  try {
    let thread = await service.create(board);
    const threadId = thread.id;

    const command  = new ReplyToThreadCommand({ ...request.body.post, threadId });
    const postService  = Container.get(PostService);
    await postService.replyToThreadHandler(command);

    thread = await service.getThreadWithPosts(threadId);
    response.json({ thread });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      return response.status(404).json({ message: `Board ${board} not found` });
    }
    next(e);
  }
}
