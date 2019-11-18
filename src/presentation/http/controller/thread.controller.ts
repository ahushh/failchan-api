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
import { Container } from 'typedi';
import { CreatePostAction } from '../../../app/actions/post/create';
import { UpdatePostAction } from '../../../app/actions/post/update';
import { ThreadService } from '../../../app/service/thread.service';

@controller('/threads')
export class ThreadController implements interfaces.Controller {
  constructor() { }

  @httpPost('/:threadId/posts')
  private async createPost(
    @requestParam('threadId') threadId: number,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const post = await new CreatePostAction({
        threadId,
        ...request.body.post,
      }).execute();

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
    const service = Container.get(ThreadService);
    const thread = await service.getThreadWithPosts(+request.params.threadId);
    response.json({ thread });
  }
}
