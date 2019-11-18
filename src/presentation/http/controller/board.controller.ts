import { Request, Response } from 'express-serve-static-core';
import {
  controller,
  httpDelete,
  httpGet, httpPost,
  interfaces,
  next,
  queryParam,
  request,
  requestParam,
  response,
} from 'inversify-express-utils';
import { CreateBoardAction } from '../../../app/actions/board/create';
import { ListBoardAction } from '../../../app/actions/board/list';
import { CreateThreadAction } from '../../../app/actions/thread/create';
import { ListThreadsByBoardAction } from '../../../app/actions/thread/list';

@controller('/boards')
export class BoardController implements interfaces.Controller {

  constructor() {}

  @httpPost('/')
  private async create(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const board = await new CreateBoardAction(request.body).execute();
      response.json({ board });
    } catch (e) {
      if (e.name === 'AlreadyExists') {
        response.status(400).json({ error: e.message });
      }
      next(e);
    }
  }

  @httpGet('/')
  private async list(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const boards = await new ListBoardAction().execute();
    response.json({ boards });
  }

  @httpGet('/:boardSlug/threads')
  private async listThreads(
    @queryParam('skip') skip: number, @requestParam('boardSlug') boardSlug: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const threads = await new ListThreadsByBoardAction({
      boardSlug,
      skip,
    }).execute();
    response.json({ threads });
  }

  @httpPost('/:boardSlug/threads')
  private async createThread(
    @requestParam('boardSlug') boardSlug: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const thread = await new CreateThreadAction({
        boardSlug,
        body: request.body.post.body,
        attachment: request.body.post.attachment,
        referencies: request.body.post.referencies,
        threadId: request.body.post.threadId,
      }).execute();
      response.json({ thread });
    } catch (e) {
      if (e.name === 'CacheRecordNotFound') {
        return response.status(400).json({ error: e.message });
      }
      if (e.name === 'EntityNotFound') {
        return response.status(404).json({ message: `Board ${boardSlug} not found` });
      }
      next(e);
    }
  }
}
