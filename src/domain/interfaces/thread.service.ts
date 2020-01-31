import { Thread } from '../entity/thread';

export interface IThreadService {
  create(request: {
    post: {
      body: string;
      attachmentIds: number[];
      references: number[];
      threadId: number;
    };
    boardSlug: string;
  }): Promise<{ thread: Thread; token?: string }>;
  listThreadsByBoard(params: {
    boardSlug: string,
    previewPosts: number,
    take: number,
    skip: number,
  }): Promise<Thread[]>;
}
