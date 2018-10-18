import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';
import { ICreatePostCommand } from '../../../app/commands/post';

export async function threadsCreateAction(request: Request, response: Response, next: Function) {
  const command: ICreatePostCommand = request.body.post;
  const board = request.params.boardSlug;
  const service = Container.get(ThreadService);
  try {
    const thread = await service.create(board, command);
    response.json({ thread });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      return response.status(404).json({ message: `Board ${board} not found` });
    }
    next(e);
  }
}
