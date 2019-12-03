
import { Repository } from 'typeorm';
import { Thread } from '../../domain/entity/thread';

export interface IThreadRepository extends Repository<Thread> {
  findOneOrFail: Repository<Thread>['findOneOrFail'];
  getThreadsWithPreviewPosts(
    boardId: number,
    findOptions: {
      previewPosts: number,
      skip?: number,
      take?: number,
    },
  ): Promise<Thread[]>;
}
