import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
// tslint:disable-next-line:import-name
import R from 'ramda';

import { Repository } from 'typeorm';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { Board } from '../../domain/entity/board';
import { BoardRepository } from '../../infra/repository/board.repo';
import { Post } from '../../domain/entity/post';
import { Attachment } from '../../domain/entity/attachment';
import { PostService } from './post.service';
import { ListThreadsByBoardCommand } from '../commands/thread';
import { ReplyToThreadCommand } from '../commands/post';

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
    const thread = new Thread();
    thread.board = board;
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
