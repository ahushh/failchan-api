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

@controller('/posts')
export class PostController implements interfaces.Controller {
  constructor() { }

  @httpPatch('/:postId')
  private async update(
    @requestParam('postId') postId: number,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      await new UpdatePostAction({ ...request.body.post, postId }).execute();
      response.sendStatus(204);
    } catch (e) {
      if (e.name === 'EntityNotFound') {
        response.status(404).json({ message: `Post ${postId} not found` });
      }
      next(e);
    }
  }
}
