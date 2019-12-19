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
import { CreatePostAction } from '../../actions/post/create';
import { UpdatePostAction } from '../../actions/post/update';
import { ThreadService } from '../../../app/service/thread.service';
import { IOC_TYPE } from '../../../config/type';

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
      const post = await this.createPostAction.execute({
        threadId,
        ...request.body.post,
      });

      response.json({ post });
    } catch (e) {
      if (e.name === 'CacheRecordNotFound') {
        return response.status(400).json({ error: e.message });
      }
      if (e.name === 'EntityNotFound') {
        return response.status(404).json({ error: `Thread ${request.params.threadId} not found` });
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
