import { Request, Response } from 'express';
import { Container } from 'typedi';
import { IPost } from '../../../domain/entity/post';
import { PostService } from '../../../app/service/post.service';

export async function postsCreateAction(request: Request, response: Response) {
  const threadId = request.params.threadId;
  const postData: IPost = request.body.post;
  const service = Container.get(PostService);
  const createdPost = await service.replyToThread(threadId, postData);

  response.json({ post: createdPost });
}
