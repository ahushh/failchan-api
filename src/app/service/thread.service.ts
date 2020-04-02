import Joi from '@hapi/joi';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import R from 'ramda';

import { IOC_TYPE } from '../../config/type';
import { Board } from '../../domain/entity/board';
import { IPostDTO } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { IPostService } from '../../domain/interfaces/post.service';
import { IThreadService } from '../../domain/interfaces/thread.service';
import { AppErrorEntityNotFound } from '../errors/not-found';
import { AppErrorUnexpected } from '../errors/unexpected';
import { validate } from '../errors/validation';
import { IBoardRepository } from '../interfaces/board.repo';
import { IThreadRepository } from '../interfaces/thread.repo';

@provide(IOC_TYPE.ThreadService)
export class ThreadService implements IThreadService {
  constructor(
    @inject(IOC_TYPE.ThreadRepository) private threadRepo: IThreadRepository,
    @inject(IOC_TYPE.BoardRepository) private boardRepo: IBoardRepository,
    @inject(IOC_TYPE.PostService) private postService: IPostService,
  ) { }

  @validate(Joi.object({
    boardSlug: Joi.string().required(),
    token: Joi.string(),
    post: Joi.any(),
  }))
  async create(request: {
    post: IPostDTO,
    boardSlug: string;
    token?: string;
  }): Promise<{ thread: Thread; token?: string }> {
    let board: Board;
    try {
      board = await this.boardRepo.getBySlug(request.boardSlug);
    } catch (e) {
      throw new AppErrorEntityNotFound(e, `Board ${request.boardSlug}`);
    }

    const thread = Thread.create(board);
    const { id: threadId } = await this.threadRepo.save(thread);
    const replyRequest = {
      ...request.post,
      threadId,
      token: request.token,
    };
    const { token } = await this.postService.replyToThread(replyRequest);
    const resultThread = await this.getThreadWithPosts(threadId);
    return { token, thread: resultThread };
  }

  /**
   *
   * @throws {AppErrorNotFound}
   * @throws {AppValidationError}
   * @throws {AppErrorUnexpected}
   * @param {{
   *     boardSlug: string,
   *     previewPosts: number,
   *     take: number,
   *     skip: number,
   *   }} params
   * @returns {Promise<Thread[]>}
   * @memberof ThreadService
   */
  @validate(Joi.object({
    boardSlug: Joi.string().required(),
    previewPosts: Joi.number(),
    take: Joi.number(),
    skip: Joi.number(),
  }))
  async listThreadsByBoard(params: {
    boardSlug: string,
    previewPosts: number,
    take: number,
    skip: number,
  }): Promise<Thread[]> {
    let board;
    try {
      board = await this.boardRepo.getBySlug(params.boardSlug);
    } catch (e) {
      if (e.name === 'EntityNotFound') {
        throw new AppErrorEntityNotFound(e, `Board ${params.boardSlug}`);
      }
      throw new AppErrorUnexpected(e);
    }
    try {
      return this.threadRepo
        .getThreadsWithPreviewPosts(board.id, R.omit(['boardSlug'], params));
    } catch (e) {
      throw new AppErrorUnexpected(e);
    }
  }

  @validate(Joi.number().required())
  async getThreadWithPosts(threadId: number): Promise<Thread> {
    const thread = await this.threadRepo.getThreadWithRelations(threadId);
    thread.sortPosts();
    return thread;
  }
}
