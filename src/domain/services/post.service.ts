import { Service } from 'typedi';
import { Post } from '../entity/post';
import { IDomainPostService } from '../interfaces/post.service';

@Service()
export class DomainPostService implements IDomainPostService {
  constructor() { }

  replyToThread({ thread, attachments, referencies, body }) {
    const post = Post.create(body, referencies, attachments);
    thread.reply(post);
    post.addPostToRefsReplies();
    const refs = post.referencies;
    return { post, thread, refs };
  }
  syncReferencies(post, newReferencies) {
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
