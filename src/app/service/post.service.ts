import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Post } from '../../domain/entity/post';
import { IPost } from '../../domain/interfaces/post.interface';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { Attachment } from '../../domain/entity/attachment';

@Service()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
  ) { }

  /***
   * Append attachments list to post
   */
  private async appendAttachments(post: Post, postData: IPost) {
    if (postData.attachmentIds) {
      const ids = postData.attachmentIds;
      const attachments = await this.attachmentRepo.findByIds(ids);
      post.attachments = attachments;
    } else {
      post.attachments = [];
    }
  }
  /***
   * Fetch referencies by IDs, append to post and return the list
   */
  private async appendReferencies(post: Post, postData: IPost): Promise<Post[]> {
    if (!postData.referencies) {
      return [];
    }
    const referencies = await this.postRepo.findByIds(
      postData.referencies,
      { relations: ['replies'] },
    );
    post.referencies = referencies;
    return referencies;
  }

  /***
   * Append post to replies list of each referency, save them and returns the saved list
   */
  private async appendReplies(post: Post, referencies: Post[]): Promise<Post[]> {
    const refs = referencies.map((ref: Post) => {
      return { ...ref, replies: [...ref.replies, post] };
    });
    return await this.postRepo.save(refs);
  }

  async replyToThread(threadId: number, postData: IPost): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail({ where: { id: threadId } });

    const post = new Post();
    post.thread = thread;
    post.body = postData.body;
    await this.appendAttachments(post, postData);

    const savedRefs = await this.appendReferencies(post, postData);
    const savedPost = await this.postRepo.save(post);
    await this.appendReplies(savedPost, savedRefs);
    return savedPost;
  }

  getPostsByThreadId(threadId: string): Promise<Post[]> {
    return this.postRepo.find({ where: { threadId } });
  }
  // getThreadWithPosts(boardId: string, threadId: string): Promise<Thread | undefined> {
  //   return this.postRepo.findOne({ where: { boardId, id: threadId }, relations: ['posts'] });
  // }
}
