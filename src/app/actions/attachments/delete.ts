import Container from 'typedi';
import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';

export class DeleteAttachmentAction implements IAction {
  constructor(public ids: number[]) {}
  execute() {
    const service = Container.get(AttachmentService);
    return service.delete(this.ids);
  }
}
