import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { Thread } from '../../domain/entity/thread';
import { IThreadRepository } from '../../domain/thread.repo.interface';

@EntityRepository(Thread)
export class ThreadRepository extends Repository<Thread> implements IThreadRepository {
  constructor() {
    super();
  }
  async getThreadsWithPreviewPosts(
    boardId: number,
    findOptions: {
      previewPosts: number;
      take: number;
      skip: number;
    }): Promise<Thread[]> {
    const threads = await this.find({
      skip: findOptions.skip || 0,
      take: findOptions.take || 0,
      where: { boardId },
      order: {
        updatedAt: 'DESC',
      },
      relations: ['posts', 'posts.attachments', 'posts.replies', 'posts.referencies'],
    });
    threads.forEach((thread: Thread) => {
      const op = thread.posts[0];
      thread.posts = [op, ...thread.posts.slice(thread.posts.length - findOptions.previewPosts)];
    });
    return threads;
  }
}
