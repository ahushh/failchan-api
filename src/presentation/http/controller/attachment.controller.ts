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

import { inject } from 'inversify';
import R from 'ramda';
import { CreateAttachmentAction } from '../../actions/attachments/create';
import { DeleteAttachmentAction } from '../../actions/attachments/delete';
import { IOC_TYPE } from '../../../config/type';
import { ERROR2STATUS_CODE } from '../constants/errors';

@controller('/attachments')
export class AttachmentController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.CreateAttachmentAction) public createAttachmentAction: CreateAttachmentAction,
    @inject(IOC_TYPE.DeleteAttachmentAction) public deleteAttachmentAction: DeleteAttachmentAction,
  ) { }

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
    const { uid, expiresAt } = await this.createAttachmentAction.execute(filesPrepared);
    response.json({ uid, expiresAt: +expiresAt });
  }

  @httpDelete('/')
  private async delete(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const ids = Array.isArray(request.query.ids)
      ? request.query.ids.map(Number)
      : [+request.query.ids];
    const token = request.query.token;
    try {
      await this.deleteAttachmentAction.execute({ ids, token });
      response.sendStatus(204);
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }
}
