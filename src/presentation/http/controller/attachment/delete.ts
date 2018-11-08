import { Request, Response } from 'express';
import { DeleteAttachmentAction } from '../../../../app/actions/attachments/delete';

export async function attachmentDeleteAction(request: Request, response: Response) {
  const ids = request.query.ids;
  await new DeleteAttachmentAction(ids).execute();
  response.sendStatus(204);
}
