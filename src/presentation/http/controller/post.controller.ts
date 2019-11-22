import { Request, Response } from 'express-serve-static-core';
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
import { UpdatePostAction } from '../../../app/actions/post/update';
import { IOC_TYPE } from '../../../config/type';
import { inject } from 'inversify';

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
      await this.updatePostAction.execute({ ...request.body.post, postId });
      response.sendStatus(204);
    } catch (e) {
      if (e.name === 'EntityNotFound') {
        response.status(404).json({ message: `Post ${postId} not found` });
      }
      next(e);
    }
  }
}
