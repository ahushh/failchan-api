import { Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateThreadCommand } from '../../../../app/commands/thread';
import { ThreadService } from '../../../../app/service/thread.service';

export async function threadsCreateAction(request: Request, response: Response, next: Function) {
  const board = request.params.boardSlug;
  const service = Container.get(ThreadService);
  try {
    const command = new CreateThreadCommand(board, request.body.post);
    const thread = await service.createHandler(command);
    response.json({ thread });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      return response.status(404).json({ message: `Board ${board} not found` });
    }
    next(e);
  }
}
