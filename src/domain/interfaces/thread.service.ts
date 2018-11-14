import { Thread } from '../entity/thread';

export interface IThreadService {
  create(request: {
    post: {
      body: string;
      attachmentIds: number[];
      referencies: number[];
      threadId: number;
    };
    boardSlug: string;
  }): Promise<Thread>;
  listThreadsByBoard(params: {
    boardSlug: string,
    previewPosts: number,
    take: number,
    skip: number,
  }): Promise<Thread[]>;
}
