import { Inject, Service } from 'typedi';
import { EntityManager, getManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { IDomainPostService } from '../../domain/interfaces/post.service';
import { DomainPostService } from '../../domain/services/post.service';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { ReplyToThreadCommand, UpdatePostCommand } from '../commands/post';

@Service()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
    @Inject(() => DomainPostService) private postService: IDomainPostService,
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
    await getManager().transaction(async (manager) => {
      await manager.save(newThread);
      await manager.save(post);
      await manager.save(refs);
    });
    return this.postRepo.findOneOrFail(post.id, {
      relations: ['referencies', 'attachments', 'replies'],
    });
  }

  async updatePostHandler(command: UpdatePostCommand): Promise<void> {
    const post = await this.postRepo.findOneOrFail(command.postId, {
      relations: ['referencies', 'referencies.replies'],
    });
    if (command.threadId) {
      const thread = await this.threadRepo.findOneOrFail(command.threadId);
      post.thread = thread;
    }
    if (command.body) {
      post.body = command.body;
    }
    if (command.referencies) {
      const newReferencies = await this.postRepo.findByIds(command.referencies, {
        relations: ['replies'],
      });
      const syncedRefs = this.postService.syncReferencies(post, newReferencies);
      await this.postRepo.save(syncedRefs);
    }
    if (command.attachmentIds) {
      post.attachments = await this.attachmentRepo.findByIds(command.attachmentIds);
    }
    await this.postRepo.save(post);
  }

  async findOneById(id: number): Promise<Post> {
    return this.postRepo.findOneOrFail(id, {
      relations: ['referencies', 'attachments', 'replies'],
    });
  }
}
