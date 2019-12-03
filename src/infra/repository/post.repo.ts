import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { IAttachmentRepository } from '../../app/interfaces/attachment.repo';
import { IPostRepository } from '../../app/interfaces/post.repo';
import { IThreadRepository } from '../../app/interfaces/thread.repo';
import { Attachment } from '../../domain/entity/attachment';
import { Post } from '../../domain/entity/post';
import { Thread } from '../../domain/entity/thread';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> implements IPostRepository {
  constructor() {
    super();
  }
}
