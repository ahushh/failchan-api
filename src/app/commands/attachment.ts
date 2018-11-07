
import { Container } from 'typedi';
import { AttachmentService } from '../service/attachment.service';

export interface IAttachmentFile {
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export class CreateAttachmentCommand {
  constructor(private files: IAttachmentFile[]) {}
  execute(): string {
    const service = Container.get(AttachmentService);
    return service.createMultiple(this.files);
  }
}
