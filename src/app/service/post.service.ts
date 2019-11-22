import { getManager, Repository } from 'typeorm';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { IPostService } from '../../domain/interfaces/post.service';
import { DomainPostService } from '../../domain/services/post.service';
import { IOC_TYPE } from '../../config/type';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

@provide(IOC_TYPE.PostService)
export class PostService implements IPostService {
  constructor(
    @inject(IOC_TYPE.PostRepository) private postRepo: Repository<Post>,
    @inject(IOC_TYPE.ThreadRepository) private threadRepo: Repository<Thread>,
    @inject(IOC_TYPE.AttachmentRepository) private attachmentRepo: Repository<Attachment>,
    @inject(IOC_TYPE.DomainPostService) private postService: DomainPostService,
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
