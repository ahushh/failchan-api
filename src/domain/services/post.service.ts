import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../config/type';
import { Post } from '../entity/post';
import { Thread } from '../entity/thread';
import { IReply } from '../interfaces/reply';

@provide(IOC_TYPE.DomainPostService)
export class DomainPostService {
  constructor() { }

  replyToThread(reply: IReply): { post: Post, thread: Thread, refs: Post[] } {
    const { thread, attachments, references, body } = reply;
    const post = Post.create(body, references, attachments);
    thread.bump();
    post.thread = thread;
    // thread.posts = [post];
    post.addPostToRefsReplies();
    const refs = post.references;
    return { post, thread, refs };
  }
  syncReferences(post: Post, newReferences: Post[]): Post[] {
    const newRefsIds = newReferences.map(r => r.id);
    const idsToRemove = post.references
      .filter(p => !newRefsIds.includes(p.id))
      .map(p => p.id);
    const removedRefs = post.removeReferencesByIds(idsToRemove);
    post.references = newReferences;
    post.addPostToRefsReplies();
    return [...removedRefs, ...newReferences];
  }
}
