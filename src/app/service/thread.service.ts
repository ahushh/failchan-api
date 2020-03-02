import Joi from '@hapi/joi';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import R from 'ramda';

import { IOC_TYPE } from '../../config/type';
import { Thread } from '../../domain/entity/thread';
import { IPostService } from '../../domain/interfaces/post.service';
import { IThreadService } from '../../domain/interfaces/thread.service';
import { validate } from '../errors/validate';
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
    post: {
      body: string;
      attachmentIds: number[];
      references: number[];
      threadId: number;
    };
    boardSlug: string;
    token?: string;
  }): Promise<{ thread: Thread; token?: string }> {
    const board = await this.boardRepo.getBySlug(request.boardSlug);
    const thread = Thread.create(board);
    const { id: threadId } = await this.threadRepo.save(thread);
    const replyRequest = {
      ...request.post,
      threadId,
      token: request.token,
    };
    const { token } = await this.postService.replyToThread(replyRequest);
    const resultThread = await this.getThreadWithPosts(threadId);
    return { thread: resultThread, token };
  }

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
    const board = await this.boardRepo.getBySlug(params.boardSlug);
    return this.threadRepo
      .getThreadsWithPreviewPosts(board.id, R.omit(['boardSlug'], params));
  }

  @validate(Joi.number().required())
  async getThreadWithPosts(threadId: number): Promise<Thread> {
    const thread = await this.threadRepo.getThreadWithRelations(threadId);
    thread.sortPosts();
    return thread;
  }
}
