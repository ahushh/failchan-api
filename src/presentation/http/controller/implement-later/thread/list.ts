// import { Request, Response } from 'express';
// import { ThreadService } from '../../../app/service/thread.service';

// export async function threadsListAction(request: Request, response: Response) {
//   const boardId = request.context.models.Board.id;
//   const service = Container.get(ThreadService);
//   const threads = await service.getThreadsByBoardSlug(boardId);
//   response.json({ threads });
// }
