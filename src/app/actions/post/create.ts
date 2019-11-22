import { IAction } from '../../interfaces/action';
import { AttachmentService } from '../../service/attachment.service';
import { PostService } from '../../service/post.service';
import { inject } from 'inversify';
import { IOC_TYPE } from '../../../config/type';
import { provide } from 'inversify-binding-decorators';

interface IRequest {
  body: string;
  attachment: string;
  referencies: number[];
  threadId: number;
}

@provide(IOC_TYPE.CreatePostAction)
export class CreatePostAction implements IAction {
  constructor(
    @inject(IOC_TYPE.AttachmentService) public attachmentService: AttachmentService,
    @inject(IOC_TYPE.PostService) public postService: PostService,
  ) { }
  async execute(request: IRequest) {
    const attachmentIds = request.attachment
      ? await this.attachmentService.createFromCache(request.attachment)
      : [];

    const newRequest = {
      attachmentIds,
      body: request.body,
      referencies: request.referencies,
      threadId: request.threadId,
    };
    return this.postService.replyToThread(newRequest);
  }
}
