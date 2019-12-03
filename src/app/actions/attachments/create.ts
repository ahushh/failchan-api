import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';
import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';

@provide(IOC_TYPE.CreateAttachmentAction)
export class CreateAttachmentAction implements IAction {
  constructor(
    @inject(IOC_TYPE.AttachmentService) public service: AttachmentService,
  ) {}
  execute(files: IAttachmentFile[]) {
    return this.service.saveToCache(files);
  }
}
