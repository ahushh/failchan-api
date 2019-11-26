import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';
import { ThreadService } from '../../service/thread.service';

interface IRequest {
  body: string;
  attachment: string;
  referencies: number[];
  threadId: number;
  boardSlug: string;
}

@provide(IOC_TYPE.CreateThreadAction)
export class CreateThreadAction implements IAction {
  constructor(
    @inject(IOC_TYPE.ThreadService) public service: ThreadService,
    @inject(IOC_TYPE.AttachmentService) public attachmentService: AttachmentService,
  ) {}
  async execute(originalRequest: IRequest) {
    const request = { ...originalRequest };
    request.referencies = request.referencies || [];

    const attachmentIds = request.attachment
      ? await this.attachmentService.createFromCache(request.attachment)
      : [];

    return this.service.create({
      post: {
        attachmentIds,
        body: request.body,
        referencies: request.referencies,
        threadId: request.threadId,
      },
      boardSlug: request.boardSlug,
    });
  }
}
