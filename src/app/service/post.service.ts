import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { ReplyToThreadCommand, UpdatePostCommand } from '../commands/post';

@Service()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
  ) { }

  async replyToThreadHandler(command: ReplyToThreadCommand): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail(command.threadId);
    const attachments = await this.attachmentRepo.findByIds(command.attachmentIds);
    const referencies = await this.postRepo.findByIds(command.referencies, {
      relations: ['replies'],
    });

    let post = Post.create(command.body, referencies, attachments);
    thread.reply(post);
    await this.threadRepo.save(thread);
    post = await this.postRepo.save(post);

    const refs = await post.updateRefsReplies();
    await this.postRepo.save(refs);

    return this.postRepo.findOneOrFail(post.id, {
      relations: ['referencies', 'attachments', 'replies'],
    });
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
    if (command.referencies) {
      const refs = await savedPost.updateRefsReplies();
      await this.postRepo.save(refs);
    }
    return savedPost;
  }
}
