import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';

@provide(IOC_TYPE.DeleteAttachmentAction)
export class DeleteAttachmentAction implements IAction {
  constructor(
    @inject(IOC_TYPE.AttachmentService) public service: AttachmentService,
  ) {}
  execute(ids: number[]) {
    return this.service.delete(ids);
  }
}
