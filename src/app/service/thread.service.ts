import R from 'ramda';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Board } from '../../domain/entity/board';
import { Thread } from '../../domain/entity/thread';
import { BoardRepository } from '../../infra/repository/board.repo';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { ReplyToThreadCommand } from '../commands/post';
import { CreateThreadCommand, ListThreadsByBoardCommand } from '../commands/thread';
import { PostService } from './post.service';

@Service()
export class ThreadService {
  constructor(
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Board) private boardRepo: BoardRepository,
    @Inject(type => PostService) private postService: PostService,
  ) { }

  async createHandler(command: CreateThreadCommand): Promise<Thread> {
    const board = await this.boardRepo.getBySlug(command.boardSlug);
    const thread = Thread.create(board);
    const { id: threadId } = await this.threadRepo.save(thread);
    const replyCommand  = new ReplyToThreadCommand({ ...command.post, threadId });
    await this.postService.replyToThreadHandler(replyCommand);
    return this.getThreadWithPosts(threadId);
  }

  async listThreadsByBoardHandler(params: ListThreadsByBoardCommand): Promise<Thread[]> {
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
