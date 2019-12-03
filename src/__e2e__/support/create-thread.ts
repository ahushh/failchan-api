import { getCustomRepository } from 'typeorm';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { replyToThreadFactory } from './reply-to-thread';

export const createThreadFactory = container => async (board) => {
  let thread = Thread.create(board);
  const threadRepo = getCustomRepository(ThreadRepository);
  thread = await threadRepo.save(thread);

  const replyToThread = replyToThreadFactory(container);

  await replyToThread(thread, 1);
  await replyToThread(thread, 2);
  await replyToThread(thread, 3);
};
