import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../../app/interfaces/action';
import { AttachmentService } from '../../../app/service/attachment.service';
import { AuthorService } from '../../../app/service/author.service';

@provide(IOC_TYPE.DeleteAttachmentAction)
export class DeleteAttachmentAction implements IAction {
  constructor(
    @inject(IOC_TYPE.AttachmentService) public service: AttachmentService,
  ) {}
  execute(request: { ids: number[]; token: string }) {
    return this.service.delete(request.ids, request.token);
  }
}
