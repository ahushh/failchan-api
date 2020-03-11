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
  requestHeaders,
  requestParam,
  response,
} from 'inversify-express-utils';
import { APP_ERRORS } from '../../../app/errors/error.interface';
import { IOC_TYPE } from '../../../config/type';
import { CreateBoardAction } from '../../actions/board/create';
import { ListBoardAction } from '../../actions/board/list';
import { CreateThreadAction } from '../../actions/thread/create';
import { ListThreadsByBoardAction } from '../../actions/thread/list';
import { ERROR2STATUS_CODE } from '../constants/errors';
import { getTokenFromAuthHeaders } from '../utils';

@controller('/boards')
export class BoardController implements interfaces.Controller {

  constructor(
    @inject(IOC_TYPE.CreateBoardAction) public createBoardAction: CreateBoardAction,
    @inject(IOC_TYPE.ListBoardAction) public listBoardAction: ListBoardAction,
    // tslint:disable-next-line: max-line-length
    @inject(IOC_TYPE.ListThreadsByBoardAction) public listThreadsByBoardAction: ListThreadsByBoardAction,
    @inject(IOC_TYPE.CreateThreadAction) public createThreadAction: CreateThreadAction,
  ) { }

  @httpPost('/')
  private async create(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const board = await this.createBoardAction.execute(request.body);
      response.json({ board });
    } catch (e) {
      if ([APP_ERRORS.BoardAlreadyExists, APP_ERRORS.ValidationError].includes(e.name)) {
        return response.status(400).json(e.json());
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
    try {
      const threads = await this.listThreadsByBoardAction.execute({
        boardSlug,
        skip,
      });
      response.json({ threads });
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }

  @httpPost('/:boardSlug/threads')
  private async createThread(
    @requestParam('boardSlug') boardSlug: string,
    @requestHeaders('Authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const { thread, token } = await this.createThreadAction.execute({
        boardSlug,
        body: request.body.post.body,
        attachment: request.body.post.attachment,
        references: request.body.post.references,
        threadId: request.body.post.threadId,
        token: getTokenFromAuthHeaders(authHeader) || request.body.token,
      });
      response.json({ thread, token });
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }
}
