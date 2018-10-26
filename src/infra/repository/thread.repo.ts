import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { IThreadRepository } from '../../app/interfaces/thread.repo';
import { Thread } from '../../domain/entity/thread';

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
      const posts = thread.posts.sort((a, b) => a.id > b.id ? 1 : -1);
      const op = posts[0];
      thread.posts = [op, ...posts.slice(thread.posts.length - findOptions.previewPosts)];
    });
    return threads;
  }
}
