import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { AttachmentService } from '../../../app/service/attachment.service';
import { IOC_TYPE } from '../../../config/type';
import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';

// TODO: add CLI interface
@provide(IOC_TYPE.CreateAttachmentAction)
export class CreateAttachmentAction implements IAction {
  constructor(
    @inject(IOC_TYPE.AttachmentService) public service: AttachmentService,
  ) {}
  execute(files: IAttachmentFile[]) {
    return this.service.saveToCache(files);
  }
}
