import { Thread } from '../entity/thread';
import { Repository } from 'typeorm';

export interface IThreadRepository {
  findOneOrFail: Repository<Thread>['findOneOrFail'];
  getThreadsWithPreviewPosts(boardId: number, previewPosts: number): Promise<Thread[]>;
}
