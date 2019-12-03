import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { IAttachmentRepository } from '../../app/interfaces/attachment.repo';
import { IThreadRepository } from '../../app/interfaces/thread.repo';
import { Attachment } from '../../domain/entity/attachment';
import { Thread } from '../../domain/entity/thread';

@EntityRepository(Attachment)
export class AttachmentRepository extends Repository<Attachment> implements IAttachmentRepository {
  constructor() {
    super();
  }
}
