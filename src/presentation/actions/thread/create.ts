import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../../app/interfaces/action';
import { AttachmentService } from '../../../app/service/attachment.service';
import { ThreadService } from '../../../app/service/thread.service';

interface IRequest {
  body: string;
  attachment: string;
  references: number[];
  threadId: number;
  boardSlug: string;
  token?: string;
}

@provide(IOC_TYPE.CreateThreadAction, true)
@provide('action', true)
export class CreateThreadAction implements IAction {
  payloadExample = `
    "body": "post body",
    "attachment"?: "attachmentid",
    "references": [1,2,3],
    "boardSlug": "b",
    "token"?: "verysecret"
  `;
  description = ''
  constructor(
    @inject(IOC_TYPE.ThreadService) public service: ThreadService,
    @inject(IOC_TYPE.AttachmentService) public attachmentService: AttachmentService,
  ) {}
  async execute(originalRequest: IRequest) {
    const request = { ...originalRequest };
    request.references = request.references || [];

    const attachmentIds = request.attachment
      ? await this.attachmentService.createFromCache(request.attachment)
      : [];

    return this.service.create({
      token: request.token,
      post: {
        attachmentIds,
        body: request.body,
        references: request.references,
        threadId: request.threadId,
      },
      boardSlug: request.boardSlug,
    });
  }
}
