import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';
import { IPost } from '../../../domain/interfaces/post.interface';

export async function threadsCreateAction(request: Request, response: Response, next: Function) {
  const postData: IPost = request.body.post;
  const board = request.params.boardSlug;
  const service = Container.get(ThreadService);
  try {
    const thread = await service.create(board, postData);
    response.json({ thread });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      return response.status(404).json({ message: `Board ${board} not found` });
    }
    next(e);
  }
}
