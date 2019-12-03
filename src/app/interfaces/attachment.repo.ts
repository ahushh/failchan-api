import { Repository } from 'typeorm';

import { Attachment } from '../../domain/entity/attachment';

export interface IAttachmentRepository extends Repository<Attachment> {
}
