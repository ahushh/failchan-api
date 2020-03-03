import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
  interfaces,
  next,
  queryParam,
  request,
  requestParam,
  response,
} from 'inversify-express-utils';
import { IOC_TYPE } from '../../../config/type';
import { UpdatePostAction } from '../../actions/post/update';
import { ERROR2STATUS_CODE } from '../constants/errors';

@controller('/posts')
export class PostController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.UpdatePostAction) public updatePostAction: UpdatePostAction,
  ) { }

  @httpPatch('/:postId')
  private async update(
    @requestParam('postId') postId: number,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      await this.updatePostAction.execute({
        ...request.body.post,
        postId,
        token: request.body.token,
      });
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
