import { Service } from 'typedi';

import { PostDTO } from '../dto/post';
import { Post } from '../entity/post';
import { Thread } from '../entity/thread';

export namespace Domain {
  @Service()
  export class PostService {
    constructor() { }

    replyToThread(dto: PostDTO): { post: Post, thread: Thread, refs: Post[] };
    replyToThread({ thread, attachments, referencies, body }) {
      const post = Post.create(body, referencies, attachments);
      thread.reply(post);
      post.addPostToRefsReplies();
      const refs = post.referencies;
      return { post, thread, refs };
    }
    syncReferencies(post: Post, newReferencies: Post[]): Post[] {
      const newRefsIds = newReferencies.map(r => r.id);
      const idsToRemove = post.referencies
        .filter(p => !newRefsIds.includes(p.id))
        .map(p => p.id);
      const removedRefs = post.removeReferenciesByIds(idsToRemove);
      post.referencies = newReferencies;
      post.addPostToRefsReplies();
      return [...removedRefs, ...newReferencies];
    }
  }
}
