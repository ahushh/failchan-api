import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { IThreadRepository } from '../../app/interfaces/thread.repo';
import { Thread } from '../../domain/entity/thread';
import { IAttachmentRepository } from '../../app/interfaces/attachment.repo';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { IPostRepository } from '../../app/interfaces/post.repo';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> implements IPostRepository {
  constructor() {
    super();
  }
}
