import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { Domain } from '../../domain/services/post.service';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { ReplyToThreadCommand, UpdatePostCommand } from '../commands/post';

@Service()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
    @Inject(() => Domain.PostService) private postService: Domain.PostService,
  ) { }

  async replyToThreadHandler(command: ReplyToThreadCommand): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail(command.threadId);
    const attachments = await this.attachmentRepo.findByIds(command.attachmentIds);
    const referencies = await this.postRepo.findByIds(command.referencies, {
      relations: ['replies'],
    });
    const { post, thread: newThread, refs } = this.postService.replyToThread({
      thread, attachments, referencies, body: command.body,
    });
    await this.threadRepo.save(newThread);
    await this.postRepo.save(post);
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
    // TODO: add test, move to the first `if`
    if (command.referencies) {
      const refs = savedPost.updateRefsReplies();
      await this.postRepo.save(refs);
    }
    return savedPost;
  }
}
