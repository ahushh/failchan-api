import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { IThreadRepository } from '../../app/interfaces/thread.repo';
import { Thread } from '../../domain/entity/thread';
import { IAttachmentRepository } from '../../app/interfaces/attachment.repo';
import { Attachment } from '../../domain/entity/attachment';

@EntityRepository(Attachment)
export class AttachmentRepository extends Repository<Attachment> implements IAttachmentRepository {
  constructor() {
    super();
  }
}
