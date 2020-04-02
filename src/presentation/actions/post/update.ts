import Joi from '@hapi/joi';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import { IAction } from '../../../app/interfaces/action';
import { PostService } from '../../../app/service/post.service';
import { IOC_TYPE } from '../../../config/type';
import { IPostDTO } from '../../../domain/entity/post';
import { INullable } from '../../../infra/utils/types';

interface IRequest extends INullable<IPostDTO> {
  postId: number;
  token: string;
}

@provide(IOC_TYPE.UpdatePostAction, true)
@provide('action', true)
export class UpdatePostAction implements IAction {
  payloadExample = `
    "postId": 123,
    "threadId"?: 1234,
    "body"?: "new body",
    "subject"?: "new subject",
    "attachmentIds"?: [1,2],
    "references"?: [1,3],
    "token": "verysecret,
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.PostService) public postService: PostService,
  ) { }
  execute(originalRequest: IRequest) {
    const request = { ...originalRequest };

    request.postId = +request.postId;
    request.threadId = request.threadId ? +request.threadId : null;
    request.body = request.body === undefined ? null : request.body;
    request.subject = request.subject === undefined ? null : request.subject;
    request.attachmentIds = request.attachmentIds || null;
    request.references = request.references || null;
    request.token = request.token;

    return this.postService.updatePost(request);
  }
}
