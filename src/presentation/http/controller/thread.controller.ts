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
import { APP_ERRORS } from '../../../app/errors/error.interface';
import { ThreadService } from '../../../app/service/thread.service';
import { IOC_TYPE } from '../../../config/type';
import { CreatePostAction } from '../../actions/post/create';
import { UpdatePostAction } from '../../actions/post/update';
import { ERROR2STATUS_CODE } from '../constants/errors';

@controller('/threads')
export class ThreadController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.CreatePostAction) public createPostAction: CreatePostAction,
    @inject(IOC_TYPE.ThreadService) public threadService: ThreadService,
  ) { }

  @httpPost('/:threadId/posts')
  private async createPost(
    @requestParam('threadId') threadId: number,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const { post, token } = await this.createPostAction.execute({
        threadId,
        ...request.body.post,
        token: request.body.token,
      });

      response.json({ post, token });
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }

  @httpGet('/:threadId')
  private async index(
    @requestParam('threadId') threadId: number,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const thread = await this.threadService.getThreadWithPosts(+request.params.threadId);
    response.json({ thread });
  }
}
