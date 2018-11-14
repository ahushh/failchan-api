import Container from 'typedi';
import { IAction } from '../../interfaces/action';
import { PostService } from '../../service/post.service';

interface IRequest {
  postId: number;
  threadId: number | null;
  body: string | null;
  attachmentIds: number[] | null;
  referencies: number[] | null;
}

export class UpdatePostAction implements IAction {
  constructor(public request: IRequest) {
    this.request.postId = +request.postId;
    if (!this.request.postId || isNaN(this.request.postId)) {
      throw new Error('postId must be specified');
    }
    this.request.threadId = request.threadId ? +request.threadId : null;
    this.request.body = request.body === undefined ? null : request.body;
    this.request.attachmentIds = request.attachmentIds || null;
    this.request.referencies = request.referencies || null;
  }
  execute() {
    const service = Container.get(PostService);
    return service.updatePost(this.request);
  }
}
