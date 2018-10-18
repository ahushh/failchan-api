import { Request, Response } from 'express';
import typedi, { Container } from 'typedi';
import { ThreadService } from '../../../app/service/thread.service';
import { IPost } from '../../../domain/entity/post';
import { AttachmentService } from '../../../app/service/attachment.service';

export async function threadsCreateAction(request: Request, response: Response) {
  const postData: IPost = request.body.post;
  const service = Container.get(ThreadService);
  const thread = await service.create(request.params.boardSlug, postData);
  response.json({ thread });
}
