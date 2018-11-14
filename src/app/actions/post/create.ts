import Container from 'typedi';
import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';
import { PostService } from '../../service/post.service';

interface IRequest {
  body: string;
  attachment: string;
  referencies: number[];
  threadId: number;
}

export class CreatePostAction implements IAction {
  constructor(public request: IRequest) { }
  async execute() {
    const attachmentService = Container.get(AttachmentService);
    const attachmentIds = this.request.attachment
      ? await attachmentService.createFromCache(this.request.attachment)
      : [];

    const service = Container.get(PostService);

    const request = {
      attachmentIds,
      body: this.request.body,
      referencies: this.request.referencies,
      threadId: this.request.threadId,
    };
    return service.replyToThread(request);
  }
}
