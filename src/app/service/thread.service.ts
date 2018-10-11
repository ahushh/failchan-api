import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Repository } from 'typeorm';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { Board } from '../../domain/entity/board';
import { BoardRepository } from '../../infra/repository/board.repo';
import { Post, IPost } from '../../domain/entity/post';

@Service()
export class ThreadService {
  constructor(
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Board) private boardRepo: BoardRepository,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {
    this.threadRepo = threadRepo;
    this.boardRepo = boardRepo;
  }

  async create(boardSlug: string, postData: IPost): Promise<Thread> {
    const board = await this.boardRepo.getBySlug(boardSlug);

    const thread = new Thread();
    thread.board = board;
    const threadSaved = await this.threadRepo.save(thread);

    const post = new Post();
    post.body = postData.body;
    post.thread = threadSaved;
    await this.postRepo.save(post);

    return await this.threadRepo.findOneOrFail({
      where: { id: threadSaved.id },
      relations: ['posts'],
    });
  }

  async getThreadsByBoardSlug(boardSlug: string, previewPosts = 5): Promise<Thread[]> {
    const board = await this.boardRepo.getBySlug(boardSlug);
    return this.threadRepo.getThreadsWithPreviewPosts(board.id, previewPosts);
  }
  getThreadWithPosts(boardId: string, threadId: string): Promise<Thread | undefined> {
    return this.threadRepo.findOne({ where: { boardId, id: threadId }, relations: ['posts'] });
  }
}
