import { IAction } from '../../interfaces/action';
import { PostService } from '../../service/post.service';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';

interface IRequest {
  postId: number;
  threadId: number | null;
  body: string | null;
  attachmentIds: number[] | null;
  referencies: number[] | null;
}

@provide(IOC_TYPE.UpdatePostAction)
export class UpdatePostAction implements IAction {
  constructor(
    @inject(IOC_TYPE.PostService) public postService: PostService,
  ) { }
  execute(originalRequest: IRequest) {
    const request = { ...originalRequest };

    request.postId = +request.postId;
    if (!request.postId || isNaN(request.postId)) {
      throw new Error('postId must be specified');
    }
    request.threadId = request.threadId ? +request.threadId : null;
    request.body = request.body === undefined ? null : request.body;
    request.attachmentIds = request.attachmentIds || null;
    request.referencies = request.referencies || null;

    return this.postService.updatePost(request);
  }
}
