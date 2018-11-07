import { Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateThreadCommand } from '../../../../app/commands/thread';
import { AttachmentService } from '../../../../app/service/attachment.service';
import { ThreadService } from '../../../../app/service/thread.service';

export async function threadsCreateAction(request: Request, response: Response, next: Function) {
  const attachmentService = Container.get(AttachmentService);
  let attachmentIds;
  try {
    attachmentIds = [] = request.body.post.attachment
      ? await attachmentService.createFromCache(request.body.post.attachment)
      : [];
  } catch (e) {
    if (e.name === 'CacheRecordNotFound') {
      return response.status(400).json({ error: e.message });
    }
    next(e);
  }

  const board = request.params.boardSlug;
  const service = Container.get(ThreadService);
  try {
    const command = new CreateThreadCommand(board, { ...request.body.post, attachmentIds });
    const thread = await service.createHandler(command);
    response.json({ thread });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      return response.status(404).json({ message: `Board ${board} not found` });
    }
    next(e);
  }
}
