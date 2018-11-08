import Container from 'typedi';
import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';
import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';

export class CreateAttachmentAction implements IAction {
  constructor(public files: IAttachmentFile[]) {}
  execute() {
    const service = Container.get(AttachmentService);
    return service.saveToCache(this.files);
  }
}
