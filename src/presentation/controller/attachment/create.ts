import { Request, Response } from 'express';
import { Container } from 'typedi';
import { AttachmentService } from '../../../app/service/attachment';
// tslint:disable-next-line:import-name
import R from 'ramda';

export async function attachmentCreateAction(request: Request, response: Response) {
  const service = Container.get(AttachmentService);
  const files: Express.Multer.File[] = request.files as any;
  console.log(request.files);
  response.json({
    files: files.map(
      R.curry(
        R.pick(['destination', 'filename']),
      ),
    ),
  });
}
