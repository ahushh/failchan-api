import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../../app/interfaces/action';
import { PostService } from '../../../app/service/post.service';
import { AppErrorActionRequestValidation } from '../../../app/errors/action';
import { ValidationError } from '../../../app/errors/validation';

interface IRequest {
  postId: number;
  threadId: number | null;
  body: string | null;
  attachmentIds: number[] | null;
  references: number[] | null;
}

@provide(IOC_TYPE.UpdatePostAction)
export class UpdatePostAction implements IAction {
  constructor(
    @inject(IOC_TYPE.PostService) public postService: PostService,
  ) { }
  execute(originalRequest: IRequest) {
    const request = { ...originalRequest };

    request.postId = +request.postId;
    if (!request.postId) {
      throw new AppErrorActionRequestValidation('postId', ValidationError.Required, request.postId);
    }
    if (isNaN(request.postId)) {
      throw new AppErrorActionRequestValidation('postId', ValidationError.ShouldBeNumber, request.postId);
    }
    request.threadId = request.threadId ? +request.threadId : null;
    request.body = request.body === undefined ? null : request.body;
    request.attachmentIds = request.attachmentIds || null;
    request.references = request.references || null;

    return this.postService.updatePost(request);
  }
}
