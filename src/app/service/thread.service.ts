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
import { IPost } from '../../domain/interfaces/post.interface';
import { Attachment } from '../../domain/entity/attachment';
import { PostService } from './post.service';

export interface IGetBoardParams {
  boardSlug: string;
  previewPosts: number;
  take: number;
  skip: number;
}

@Service()
export class ThreadService {
  constructor(
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Board) private boardRepo: BoardRepository,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
    @Inject(type => PostService) private postService: PostService,
  ) { }

  async create(boardSlug: string, postData: IPost): Promise<Thread> {
    const board = await this.boardRepo.getBySlug(boardSlug);
    const thread = new Thread();
    thread.board = board;
    const threadSaved = await this.threadRepo.save(thread);

    await this.postService.replyToThread(threadSaved.id, postData);

    return await this.threadRepo.findOneOrFail({
      where: { id: threadSaved.id },
      relations: ['posts', 'posts.attachments', 'posts.replies', 'posts.referencies'],
    });
  }

  async getThreadsByBoardSlug(params: IGetBoardParams): Promise<Thread[]> {
    const board = await this.boardRepo.getBySlug(params.boardSlug);
    return this.threadRepo
      .getThreadsWithPreviewPosts(board.id, R.omit(['boardSlug'], params));
  }
  getThreadWithPosts(threadId: string): Promise<Thread | undefined> {
    return this.threadRepo.findOne({
      where: { id: threadId },
      relations: ['posts', 'posts.attachments', 'posts.replies', 'posts.referencies'],
    });
  }
}
