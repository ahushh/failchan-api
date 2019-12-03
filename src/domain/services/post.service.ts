import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../config/type';
import { Post } from '../entity/post';
import { Thread } from '../entity/thread';

export interface IDomainPostService {
  replyToThread(post: Post, thread: Thread): void;
  syncReferences(post: Post, newReferences: Post[]): Post[];
}

@provide(IOC_TYPE.DomainPostService)
export class DomainPostService implements IDomainPostService {
  constructor() { }

  replyToThread(post: Post, thread: Thread) {
    thread.bump();
    post.thread = thread;
    // thread.posts = [post];
    post.addPostToRefsReplies();
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
