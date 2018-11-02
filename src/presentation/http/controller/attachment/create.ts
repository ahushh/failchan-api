import { Request, Response } from 'express';
import R from 'ramda';
import { Container } from 'typedi';
import {
  AttachmentService,
  IAttachmentFile,
} from '../../../../app/service/attachment.service';

export async function attachmentCreateAction(request: Request, response: Response) {
  const service = Container.get(AttachmentService);
  const files: Express.Multer.File[] = request.files as any[];
  const filesPrepared: IAttachmentFile[] = files.map(
    R.curry(
      R.pick(['path', 'originalname', 'mimetype', 'size']),
    ),
  );
  const ids = await service.createMultiple(filesPrepared);
  response.json({
    ids,
  });
}
