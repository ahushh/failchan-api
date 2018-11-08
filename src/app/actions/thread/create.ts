import Container from 'typedi';
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

export class CreateThreadAction implements IAction {
  constructor(public request: IRequest) {
    this.request.referencies = this.request.referencies || [];
  }
  async execute() {
    const attachmentService = Container.get(AttachmentService);
    const attachmentIds = this.request.attachment
      ? await attachmentService.createFromCache(this.request.attachment)
      : [];

    const service = Container.get(ThreadService);
    return service.createHandler({
      post: {
        attachmentIds,
        body: this.request.body,
        referencies: this.request.referencies,
        threadId: this.request.threadId,
      },
      boardSlug: this.request.boardSlug,
    });
  }
}
