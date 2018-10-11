import { Request, Response } from 'express';
import { Post, IPost } from '../../entity/post';
import { Container } from 'typedi';
import { PostService } from '../../service/post.service';

export async function postsCreateAction(request: Request, response: Response) {
  const threadId = request.params.threadId;
  const postData: IPost = request.body;
  const service = Container.get(PostService);
  const createdPost = await service.create(threadId, postData);

  response.json({ post: createdPost });
}
