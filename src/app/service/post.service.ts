import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { getManager, Repository } from 'typeorm';
import { IOC_TYPE } from '../../config/type';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { IPostService } from '../../domain/interfaces/post.service';
import { IDomainPostService } from '../../domain/services/post.service';
import { IThreadRepository } from '../interfaces/thread.repo';
import { IAttachmentRepository } from '../interfaces/attachment.repo';
import { IPostRepository } from '../interfaces/post.repo';

@provide(IOC_TYPE.PostService)
export class PostService implements IPostService {
  constructor(
    @inject(IOC_TYPE.PostRepository) private postRepo: IPostRepository,
    @inject(IOC_TYPE.ThreadRepository) private threadRepo: IThreadRepository,
    @inject(IOC_TYPE.AttachmentRepository) private attachmentRepo: IAttachmentRepository,
    @inject(IOC_TYPE.DomainPostService) private postService: IDomainPostService,
  ) { }

  async replyToThread(request: {
    threadId: number;
    body: string;
    attachmentIds: number[];
    references: number[];
  }): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail(request.threadId);
    const attachments = await this.attachmentRepo.findByIds(request.attachmentIds);
    const references = await this.postRepo.findByIds(request.references, {
      relations: ['replies'],
    });

    const post = Post.create({ references, attachments, body: request.body });
    this.postService.replyToThread(post, thread);

    await getManager().transaction(async (manager) => {
      await manager.save(thread);
      await manager.save(post);
      await manager.save(post.references);
    });
    return this.postRepo.findOneOrFail(post.id, {
      relations: ['references', 'attachments', 'replies'],
    });
  }

  async updatePost(request: {
    postId: number;
    threadId: number | null;
    body: string | null;
    attachmentIds: number[] | null;
    references: number[] | null;
  }): Promise<void> {
    const post = await this.postRepo.findOneOrFail(request.postId, {
      relations: ['references', 'references.replies'],
    });
    if (request.threadId) {
      const thread = await this.threadRepo.findOneOrFail(request.threadId);
      post.thread = thread;
    }
    if (request.body) {
      post.body = request.body;
    }
    if (request.references) {
      const newReferences = await this.postRepo.findByIds(request.references, {
        relations: ['replies'],
      });
      const syncedRefs = this.postService.syncReferences(post, newReferences);
      await this.postRepo.save(syncedRefs);
    }
    if (request.attachmentIds) {
      post.attachments = await this.attachmentRepo.findByIds(request.attachmentIds);
    }
    await this.postRepo.save(post);
  }

  async findOneById(id: number): Promise<Post> {
    return this.postRepo.findOneOrFail(id, {
      relations: ['references', 'attachments', 'replies'],
    });
  }
}
