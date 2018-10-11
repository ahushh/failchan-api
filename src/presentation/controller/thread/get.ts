// import { Request, Response } from 'express';
// import { Container } from 'typedi';
// import { ThreadService } from '../../../app/service/thread.service';

// export async function threadsGetAction(request: Request, response: Response) {
//   const thread = request.context.models.Thread;
//   const service = Container.get(ThreadService);
//   const threadWithPosts = await service.getThreadWithPosts(thread.boardId, thread.id);
//   if (!thread) {
//     return response.status(404).send({ message: 'Not found' });
//   }
//   response.json({ thread: threadWithPosts });
// }
