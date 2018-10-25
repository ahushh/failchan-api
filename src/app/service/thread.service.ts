import R from 'ramda';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Attachment } from '../../domain/entity/attachment';
import { Board } from '../../domain/entity/board';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { BoardRepository } from '../../infra/repository/board.repo';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { ReplyToThreadCommand } from '../commands/post';
import { ListThreadsByBoardCommand } from '../commands/thread';
import { PostService } from './post.service';

@Service()
export class ThreadService {
  constructor(
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Board) private boardRepo: BoardRepository,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
    @Inject(type => PostService) private postService: PostService,
  ) { }

  async create(boardSlug: string): Promise<Thread> {
    const board = await this.boardRepo.getBySlug(boardSlug);
    const thread = Thread.create(board);
    return this.threadRepo.save(thread);
  }

  async getThreadsByBoardSlug(params: ListThreadsByBoardCommand): Promise<Thread[]> {
    const board = await this.boardRepo.getBySlug(params.boardSlug);
    return this.threadRepo
      .getThreadsWithPreviewPosts(board.id, R.omit(['boardSlug'], params));
  }
  getThreadWithPosts(threadId: number): Promise<Thread> {
    return this.threadRepo.findOneOrFail({
      where: { id: threadId },
      relations: ['posts', 'posts.attachments', 'posts.replies', 'posts.referencies'],
    });
  }
}
