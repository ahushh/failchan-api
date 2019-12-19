import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAttachmentFile } from '../../../domain/interfaces/attachment-file';
import { IAction } from '../../../app/interfaces/action';
import { AttachmentService } from '../../../app/service/attachment.service';
import { ValidationError } from '../../../app/errors/validation';
import { AppErrorActionRequestValidation } from '../../../app/errors/action';

@provide(IOC_TYPE.CreateAttachmentAction)
export class CreateAttachmentAction implements IAction {
  constructor(
    @inject(IOC_TYPE.AttachmentService) public service: AttachmentService,
  ) {}
  execute(files: IAttachmentFile[]) {
    if (files.length === 0) {
      throw new AppErrorActionRequestValidation('files', ValidationError.Required, files);
    }
    return this.service.saveToCache(files);
  }
}
