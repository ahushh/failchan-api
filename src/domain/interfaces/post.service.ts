import { Post } from '../entity/post';
import { Thread } from '../entity/thread';

export interface IPostService {
  replyToThread(request: {
    threadId: number;
    body: string;
    attachmentIds: number[];
    references: number[];
  }): Promise<Post>;

  updatePost(request: {
    postId: number;
    threadId: number | null;
    body: string | null;
    attachmentIds: number[] | null;
    references: number[] | null;
  }): Promise<void>;
}
