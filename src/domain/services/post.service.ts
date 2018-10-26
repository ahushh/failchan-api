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
      const refs = post.updateRefsReplies();
      return { post, thread, refs };
    }
  }
}
