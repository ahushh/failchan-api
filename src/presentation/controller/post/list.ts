// import { Request, Response } from 'express';
// import { Container } from 'typedi';
// import { PostService } from '../../../app/service/post.service';

// export async function postsListAction(request: Request, response: Response) {
//   const thread = request.context.models.Thread;
//   const service = Container.get(PostService);
//   const posts = await service.getPostsByThreadId(thread.id);
//   response.json({ posts });
// }
