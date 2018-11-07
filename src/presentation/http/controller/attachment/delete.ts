import { Request, Response } from 'express';
import R from 'ramda';
import { Container } from 'typedi';
import {
  AttachmentService,
  IAttachmentFile,
} from '../../../../app/service/attachment.service';

export async function attachmentDeleteAction(request: Request, response: Response) {
  const service = Container.get(AttachmentService);
  const ids = request.query.ids;
  await service.delete(ids);
  response.sendStatus(204);
}
