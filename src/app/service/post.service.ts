import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { getManager, Repository } from 'typeorm';
import { IOC_TYPE } from '../../config/type';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';
import { IPostService } from '../../domain/interfaces/post.service';
import { IThreadRepository } from '../interfaces/thread.repo';
import { IAttachmentRepository } from '../interfaces/attachment.repo';
import { IPostRepository } from '../interfaces/post.repo';
import { TransactionService } from './transaction.service';
import { IAuthorRepository } from '../interfaces/author.repo';
import { Author } from '../../domain/entity/author';
import { AppErrorInvalidToken } from '../errors/token';
import { IAuthorService } from '../../domain/interfaces/author.service';

interface IReplyToThread {
  threadId: number;
  body: string;
  attachmentIds: number[];
  references: number[];
  token?: string;
}

interface IUpdatePost {
  postId: number;
  threadId: number | null;
  body: string | null;
  attachmentIds: number[] | null;
  references: number[] | null;
  token: string;
}

@provide(IOC_TYPE.PostService)
export class PostService implements IPostService {
  constructor(
    @inject(IOC_TYPE.PostRepository) private postRepo: IPostRepository,
    @inject(IOC_TYPE.ThreadRepository) private threadRepo: IThreadRepository,
    @inject(IOC_TYPE.AttachmentRepository) private attachmentRepo: IAttachmentRepository,
    @inject(IOC_TYPE.AuthorService) private authorService: IAuthorService,
    @inject(IOC_TYPE.TransactionService) private transactionService: TransactionService,
  ) { }

  async replyToThread(request: IReplyToThread): Promise<{ post: Post; token?: string }> {
    const thread = await this.threadRepo.findOneOrFail(request.threadId);
    const attachments = await this.attachmentRepo.findByIds(request.attachmentIds);
    const references = await this.postRepo.findByIds(request.references, {
      relations: ['replies'],
    });

    const { isNew, author } = await this.authorService.getAuthorByToken(request.token);

    const post = Post.create({ references, attachments, body: request.body });
    thread.replyWith(post);
    post.author = author;

    await this.transactionService.run(async (manager) => {
      await manager.save(thread);
      await manager.save(post);
      await manager.save(post.references);
    });

    const responsePost = await this.postRepo.findOneOrFail(post.id, {
      relations: ['references', 'attachments', 'replies'],
    });
    const result = { 
      post: responsePost,
      token: undefined,
    };

    if (isNew) {
      return {
        ...result,
        token: author.generateToken()
      }
    }
    return result;
  }

  async updatePost(request: IUpdatePost): Promise<void> {
    const post = await this.postRepo.findOneOrFail(request.postId, {
      relations: ['references', 'references.replies', 'author'],
    });
    this.authorService.checkAuthorshipByToken(request.token, post.author);

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
      const refsToUpdate = post.updateReferences(newReferences);
      await this.postRepo.save(Object.values(refsToUpdate).reduce((a, c) => [...a, ...c], []));
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
