import { Request, Response } from 'express';
import R from 'ramda';
import { CreateAttachmentAction } from '../../../../app/actions/attachments/create';
import { IAttachmentFile } from '../../../../domain/interfaces/attachment-file';

export async function attachmentCreateAction(request: Request, response: Response) {
  const files: Express.Multer.File[] = request.files as any[];
  const filesPrepared: IAttachmentFile[] = files.map(
    R.curry(
      R.pick(['path', 'originalname', 'mimetype', 'size']),
    ),
  );
  const uid = await new CreateAttachmentAction(filesPrepared).execute();
  response.json({ uid });
}
