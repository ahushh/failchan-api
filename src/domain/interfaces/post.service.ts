import { Post } from '../entity/post';
import { Thread } from '../entity/thread';
import { IReply } from './reply';

export interface IDomainPostService {
  replyToThread(reply: IReply): { post: Post, thread: Thread, refs: Post[] };
  syncReferencies(post: Post, newReferencies: Post[]): Post[];
}

export interface IPostService {
  replyToThread(request: {
    threadId: number;
    body: string;
    attachmentIds: number[];
    referencies: number[];
  }): Promise<Post>;

  updatePost(request: {
    postId: number;
    threadId: number | null;
    body: string | null;
    attachmentIds: number[] | null;
    referencies: number[] | null;
  }): Promise<void>;
}
