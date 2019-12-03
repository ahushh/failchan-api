import { Container } from 'inversify';
import { getCustomRepository } from 'typeorm';
import { Thread } from '../../domain/entity/thread';
import { ThreadRepository } from '../../infra/repository/thread.repo';
import { replyToThreadFactory } from './reply-to-thread';

export const createManyThreadsFactory = (
  container: Container,
  threadsNumber = 20,
  postsPerThread = 10,
  fillBodyWith: 'board' | 'index' = 'board',
) => async (board) => {
  const createOne = async () => {
    const thread = Thread.create(board);
    const threadRepo = getCustomRepository(ThreadRepository);
    return await threadRepo.save(thread);
  };
  const replyToThread = replyToThreadFactory(container);
  let threadsN = threadsNumber;

  // creates posts with id 1...threadsNumber
  while (threadsN !== 0) {
    const thread = await createOne();
    let postsNumber: number = 1;
    // creates posts with body #1...#postsPerThread
    while (postsNumber <= postsPerThread) {
      await replyToThread(thread, fillBodyWith === 'board' ? board.slug : `#${postsNumber}`);
      postsNumber = postsNumber + 1;
    }
    threadsN = threadsN - 1;
  }
};
