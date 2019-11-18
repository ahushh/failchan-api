import { Request, Response } from 'express-serve-static-core';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  interfaces,
  next,
  queryParam,
  request,
  requestParam,
  response,
} from 'inversify-express-utils';

import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';
import { fileUploadMiddleware } from '../middleware/file-upload';

import R from 'ramda';
import { CreateAttachmentAction } from '../../../app/actions/attachments/create';
import { DeleteAttachmentAction } from '../../../app/actions/attachments/delete';

@controller('/attachments')
export class AttachmentController implements interfaces.Controller {
  constructor() { }

  @httpPost('/', fileUploadMiddleware)
  private async create(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const files: Express.Multer.File[] = request.files as any[];
    const filesPrepared: IAttachmentFile[] = files.map(
      R.curry(
        R.pick(['path', 'originalname', 'mimetype', 'size']),
      ),
    );
    const uid = await new CreateAttachmentAction(filesPrepared).execute();
    response.json({ uid });
  }

  @httpDelete('/')
  private async delete(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const ids = request.query.ids;
    await new DeleteAttachmentAction(ids).execute();
    response.sendStatus(204);
  }
}
