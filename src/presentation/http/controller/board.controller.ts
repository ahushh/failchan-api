import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
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
import { CreateBoardAction } from '../../actions/board/create';
import { ListBoardAction } from '../../actions/board/list';
import { CreateThreadAction } from '../../actions/thread/create';
import { ListThreadsByBoardAction } from '../../actions/thread/list';
import { IOC_TYPE } from '../../../config/type';

@controller('/boards')
export class BoardController implements interfaces.Controller {

  constructor(
    @inject(IOC_TYPE.CreateBoardAction) public createBoardAction: CreateBoardAction,
    @inject(IOC_TYPE.ListBoardAction) public listBoardAction: ListBoardAction,
    // tslint:disable-next-line: max-line-length
    @inject(IOC_TYPE.ListThreadsByBoardAction) public listThreadsByBoardAction: ListThreadsByBoardAction,
    @inject(IOC_TYPE.CreateThreadAction) public createThreadAction: CreateThreadAction,
  ) {}

  @httpPost('/')
  private async create(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const board = await this.createBoardAction.execute(request.body);
      response.json({ board });
    } catch (e) {
      if (e.name === 'AlreadyExists') {
        return response.status(400).json({ error: e.message });
      }
      next(e);
    }
  }

  @httpGet('/')
  private async list(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const boards = await this.listBoardAction.execute();
    response.json({ boards });
  }

  @httpGet('/:boardSlug/threads')
  private async listThreads(
    @queryParam('skip') skip: number, @requestParam('boardSlug') boardSlug: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    const threads = await this.listThreadsByBoardAction.execute({
      boardSlug,
      skip,
    });
    response.json({ threads });
  }

  @httpPost('/:boardSlug/threads')
  private async createThread(
    @requestParam('boardSlug') boardSlug: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const { thread, token } = await this.createThreadAction.execute({
        boardSlug,
        body: request.body.post.body,
        attachment: request.body.post.attachment,
        references: request.body.post.references,
        threadId: request.body.post.threadId,
        token: request.body.token,
      });
      response.json({ thread, token });
    } catch (e) {
      if (e.name === 'InvalidToken') {
        return response.status(403).json({ error: e.message });
      }
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
