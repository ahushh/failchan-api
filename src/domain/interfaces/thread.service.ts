import { IPostDTO } from '../entity/post';
import { Thread } from '../entity/thread';

export interface IThreadService {
  create(request: {
    post: IPostDTO,
    boardSlug: string;
  }): Promise<{ thread: Thread; token?: string }>;
  listThreadsByBoard(params: {
    boardSlug: string,
    previewPosts: number,
    take: number,
    skip: number,
  }): Promise<Thread[]>;
}
