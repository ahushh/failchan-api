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
      where: { board: { id: boardId } },
      order: {
        updatedAt: 'DESC',
      },
      relations: ['posts', 'posts.attachments', 'posts.replies', 'posts.referencies'],
    });
    threads.forEach((thread: Thread) => {
      thread.sortPosts();
      const [op, ...posts] = thread.posts;
      const replies = posts.slice(posts.length - findOptions.previewPosts);
      thread.posts = [op, ...replies];
    });
    return threads;
  }
  async getThreadWithRelations(id: number): Promise<Thread> {
    return await this.findOneOrFail(id, {
      relations: ['posts', 'posts.attachments', 'posts.replies', 'posts.referencies'],
    });
  }
}
