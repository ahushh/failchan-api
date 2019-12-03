import { Post } from '../entity/post';
import { Thread } from '../entity/thread';
import { IReply } from './reply';

export interface IDomainPostService {
  replyToThread(reply: IReply): { post: Post, thread: Thread, refs: Post[] };
  syncReferences(post: Post, newReferences: Post[]): Post[];
}

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
