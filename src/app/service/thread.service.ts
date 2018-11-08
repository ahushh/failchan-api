import R from 'ramda';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Board } from '../../domain/entity/board';
import { Thread } from '../../domain/entity/thread';
import { BoardRepository } from '../../infra/repository/board.repo';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { PostService } from './post.service';

@Service()
export class ThreadService {
  constructor(
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Board) private boardRepo: BoardRepository,
    @Inject(type => PostService) private postService: PostService,
  ) { }

  async createHandler(request: {
    post: {
      body: string;
      attachmentIds: number[];
      referencies: number[];
      threadId: number;
    };
    boardSlug: string;
  }): Promise<Thread> {
    const board = await this.boardRepo.getBySlug(request.boardSlug);
    const thread = Thread.create(board);
    const { id: threadId } = await this.threadRepo.save(thread);
    const replyRequest = {
      threadId,
      ...request.post,
    };
    await this.postService.replyToThreadHandler(replyRequest);
    return this.getThreadWithPosts(threadId);
  }

  async listThreadsByBoardHandler(params: {
    boardSlug: string,
    previewPosts: number,
    take: number,
    skip: number,
  }): Promise<Thread[]> {
    const board = await this.boardRepo.getBySlug(params.boardSlug);
    return this.threadRepo
      .getThreadsWithPreviewPosts(board.id, R.omit(['boardSlug'], params));
  }
  async getThreadWithPosts(threadId: number): Promise<Thread> {
    const thread = await this.threadRepo.getThreadWithRelations(threadId);
    thread.sortPosts();
    return thread;
  }
}
