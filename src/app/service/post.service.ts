import { Inject, Service } from 'typedi';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { IPostService } from '../../domain/interfaces/post.service';
import { DomainPostService } from '../../domain/services/post.service';
import { ThreadRepository } from '../../infra/repository/thread.repo';

@Service()
export class PostService implements IPostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
    @Inject(() => DomainPostService) private postService: DomainPostService,
  ) { }

  async replyToThread(request: {
    threadId: number;
    body: string;
    attachmentIds: number[];
    referencies: number[];
  }): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail(request.threadId);
    const attachments = await this.attachmentRepo.findByIds(request.attachmentIds);
    const referencies = await this.postRepo.findByIds(request.referencies, {
      relations: ['replies'],
    });
    const { post, thread: newThread, refs } = this.postService.replyToThread({
      thread, attachments, referencies, body: request.body,
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

  async updatePost(request: {
    postId: number;
    threadId: number | null;
    body: string | null;
    attachmentIds: number[] | null;
    referencies: number[] | null;
  }): Promise<void> {
    const post = await this.postRepo.findOneOrFail(request.postId, {
      relations: ['referencies', 'referencies.replies'],
    });
    if (request.threadId) {
      const thread = await this.threadRepo.findOneOrFail(request.threadId);
      post.thread = thread;
    }
    if (request.body) {
      post.body = request.body;
    }
    if (request.referencies) {
      const newReferencies = await this.postRepo.findByIds(request.referencies, {
        relations: ['replies'],
      });
      const syncedRefs = this.postService.syncReferencies(post, newReferencies);
      await this.postRepo.save(syncedRefs);
    }
    if (request.attachmentIds) {
      post.attachments = await this.attachmentRepo.findByIds(request.attachmentIds);
    }
    await this.postRepo.save(post);
  }

  async findOneById(id: number): Promise<Post> {
    return this.postRepo.findOneOrFail(id, {
      relations: ['referencies', 'attachments', 'replies'],
    });
  }
}
