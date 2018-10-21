import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { Attachment } from '../../domain/entity/attachment';
import { ReplyToThreadCommand, UpdatePostCommand } from '../commands/post';

@Service()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
  ) { }

  private async createPost(
    command: ReplyToThreadCommand, thread: Thread,
  ) {
    const post = new Post();
    post.thread = thread;
    post.body = command.body;
    post.attachments = await this.attachmentRepo.findByIds(command.attachmentIds);
    post.referencies = await this.postRepo.findByIds(command.referencies, {
      relations: ['replies'],
    });
    const savedPost = await this.postRepo.save(post);
    await this.updateRefsReplies(savedPost);
    return savedPost;
  }

  async replyToThreadHandler(command: ReplyToThreadCommand): Promise<Post> {
    let thread = await this.threadRepo.findOneOrFail(command.threadId);
    thread.bump();
    thread = await this.threadRepo.save(thread);

    return this.createPost(command, thread);
  }

  async updatePostHandler(command: UpdatePostCommand): Promise<Post> {
    const post = await this.postRepo.findOneOrFail(command.postId);
    if (command.threadId) {
      const thread = await this.threadRepo.findOneOrFail(command.threadId);
      post.thread = thread;
    }
    if (command.body) {
      post.body = command.body;
    }
    if (command.referencies) {
      post.referencies = await this.postRepo.findByIds(command.referencies, {
        relations: ['replies'],
      });
    }
    if (command.attachmentIds) {
      post.attachments = await this.attachmentRepo.findByIds(command.attachmentIds);
    }
    const savedPost = await this.postRepo.save(post);
    await this.updateRefsReplies(savedPost);
    return savedPost;
  }

  private updateRefsReplies(post: Post) {
    const refs = post.referencies.map((ref: Post) =>
      ({ ...ref, replies: [...ref.replies, post] }),
    );
    return this.postRepo.save(refs);
  }
}
