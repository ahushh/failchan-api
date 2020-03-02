import Joi from '@hapi/joi';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import { IOC_TYPE } from '../../../config/type';
import { IAction } from '../../../app/interfaces/action';
import { PostService } from '../../../app/service/post.service';

interface IRequest {
  postId: number;
  threadId: number | null;
  body: string | null;
  attachmentIds: number[] | null;
  references: number[] | null;
  token: string;
}

@provide(IOC_TYPE.UpdatePostAction, true)
@provide('action', true)
export class UpdatePostAction implements IAction {
  payloadExample = `
    "postId": 123,
    "threadId"?: 1234,
    "body"?: "new body",
    "attachmentIds"?: [1,2],
    "references"?: [1,3],
    "token": "verysecret,
  `;
  description = ''
  constructor(
    @inject(IOC_TYPE.PostService) public postService: PostService,
  ) { }
  execute(originalRequest: IRequest) {
    const request = { ...originalRequest };

    request.postId = +request.postId;
    request.threadId = request.threadId ? +request.threadId : null;
    request.body = request.body === undefined ? null : request.body;
    request.attachmentIds = request.attachmentIds || null;
    request.references = request.references || null;
    request.token = request.token;

    return this.postService.updatePost(request);
  }
}
