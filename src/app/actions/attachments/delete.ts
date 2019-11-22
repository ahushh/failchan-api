import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';
import { IOC_TYPE } from '../../../config/type';
import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';

@provide(IOC_TYPE.DeleteAttachmentAction)
export class DeleteAttachmentAction implements IAction {
  constructor(
    @inject(IOC_TYPE.AttachmentService) public service: AttachmentService,
  ) {}
  execute(ids: number[]) {
    return this.service.delete(ids);
  }
}
