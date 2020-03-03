import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { AttachmentService } from '../../../app/service/attachment.service';
import { AuthorService } from '../../../app/service/author.service';
import { IOC_TYPE } from '../../../config/type';

@provide(IOC_TYPE.DeleteAttachmentAction, true)
@provide('action', true)
export class DeleteAttachmentAction implements IAction {
  payloadExample = '"ids": [1, 2], "token": "verysecret"';
  description = '';
  constructor(
    @inject(IOC_TYPE.AttachmentService) public service: AttachmentService,
  ) {}
  execute(request: { ids: number[]; token: string }) {
    return this.service.delete(request.ids, request.token);
  }
}
