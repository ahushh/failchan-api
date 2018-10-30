import { Post } from '../entity/post';
import { Thread } from '../entity/thread';
import { IReply } from './reply';

export interface IDomainPostService {
  replyToThread(reply: IReply): { post: Post, thread: Thread, refs: Post[] };
  syncReferencies(post: Post, newReferencies: Post[]): Post[];
}
