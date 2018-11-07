import { Request, Response } from 'express';
import { Container } from 'typedi';
import { ReplyToThreadCommand } from '../../../../app/commands/post';
import { AttachmentService, IAttachmentFile } from '../../../../app/service/attachment.service';
import { PostService } from '../../../../app/service/post.service';
export async function postsCreateAction(request: Request, response: Response, next: Function) {
  const threadId = request.params.threadId;
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

  const command = new ReplyToThreadCommand({ ...request.body.post, attachmentIds, threadId });
  const service = Container.get(PostService);
  try {
    const createdPost = await service.replyToThreadHandler(command);
    response.json({ post: createdPost });
  } catch (e) {
    if (e.name === 'EntityNotFound') {
      response.status(404).json({ error: `Thread ${request.params.threadId} not found` });
    }
    next(e);
  }
}
