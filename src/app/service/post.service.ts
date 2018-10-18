import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Post, IPost } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { Attachment } from '../../domain/entity/attachment';

@Service()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
    ) {}

  async replyToThread(threadId: number, postData: IPost): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail({ where: { id: threadId } });
    const post = new Post();
    post.thread = thread;
    post.body = postData.body;
    if (postData.attachmentIds) {
      const ids = postData.attachmentIds;
      const attachments = await this.attachmentRepo.findByIds(ids);
      post.attachments = attachments;
    } else {
      post.attachments = [];
    }
    return this.postRepo.save(post);
  }

  getPostsByThreadId(threadId: string): Promise<Post[]> {
    return this.postRepo.find({ where: { threadId } });
  }
  // getThreadWithPosts(boardId: string, threadId: string): Promise<Thread | undefined> {
  //   return this.postRepo.findOne({ where: { boardId, id: threadId }, relations: ['posts'] });
  // }
}
