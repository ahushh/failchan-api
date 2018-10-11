import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { Board } from '../entity/board';
import { InjectManager } from 'typeorm-typedi-extensions';
import { Thread } from '../entity/thread';
import { IThreadRepository } from '../domain/thread.repo.interface';

@EntityRepository(Thread)
export class ThreadRepository extends Repository<Thread> implements IThreadRepository {
  constructor() {
    super();
  }
  getThreadsWithPreviewPosts(boardId: number, previewPosts = 5): Promise<Thread[]> {
    return this.find({ where: { boardId }, relations: ['posts'] })
      .then((threads: Thread[]) => {
        threads.forEach((thread: Thread) => {
          thread.posts = thread.posts.slice(thread.posts.length - previewPosts);
        });
        return threads;
      });
  }
}
