import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Post } from '../../domain/entity/post';
import { ICreatePostCommand } from '../commands/post';
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
  private async appendAttachments(post: Post, ids: number[] | undefined) {
    if (ids) {
      const attachments = await this.attachmentRepo.findByIds(ids);
      post.attachments = attachments;
    } else {
      post.attachments = [];
    }
  }
  /***
   * Fetch referencies by IDs, append to post and return the list
   */
  private async appendReferencies(post: Post, ids: number[] | undefined): Promise<Post[]> {
    if (!ids) {
      return [];
    }
    const referencies = await this.postRepo.findByIds(
      ids,
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

  async replyToThread(threadId: number, command: ICreatePostCommand): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail({ where: { id: threadId } });
    thread.bump();
    const threadSaved = await this.threadRepo.save(thread);

    const post  = new Post();
    post.thread = threadSaved;
    post.body   = command.body;
    await this.appendAttachments(post, command.attachmentIds);

    const savedRefs = await this.appendReferencies(post, command.referencies);
    const savedPost = await this.postRepo.save(post);
    await this.appendReplies(savedPost, savedRefs);
    return savedPost;
  }

}
