import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IAction } from '../../../app/interfaces/action';
import { AttachmentService } from '../../../app/service/attachment.service';
import { ThreadService } from '../../../app/service/thread.service';
import { IOC_TYPE } from '../../../config/type';
import { IPostDTO } from '../../../domain/entity/post';

interface IRequest extends Omit<IPostDTO, 'attachmentIds'> {
  attachment: string;
  boardSlug: string;
  token?: string;
}

@provide(IOC_TYPE.CreateThreadAction, true)
@provide('action', true)
export class CreateThreadAction implements IAction {
  payloadExample = `
    "body": "post body",
    "subject?": "subject",
    "attachment"?: "attachmentid",
    "references": [1,2,3],
    "boardSlug": "b",
    "token"?: "verysecret"
  `;
  description = '';
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
        subject: request.subject,
        references: request.references,
        threadId: request.threadId,
      },
      boardSlug: request.boardSlug,
    });
  }
}
