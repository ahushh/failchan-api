import chai from 'chai';
import supertest from 'supertest';
import { Container } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { ListThreadsByBoardAction } from '../../src/app/actions/thread/list';
import { PostService } from '../../src/app/service/post.service';
import { Board } from '../../src/domain/entity/board';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { ApplicationServer } from '../../src/presentation/http/server';

const ALL_THREADS = 20;
const POSTS_PER_THREAD = 10;

const replyToThread = async (boardSlug: string, thread, i: number) => {
  const postService = Container.get(PostService);
  const post = { body: `${boardSlug}`, attachmentIds: [], referencies: [] };
  const request = { ...post, threadId: thread.id };
  await postService.replyToThread(request);
};
const createThreads = async (board) => {
  const createOne = async () => {
    const thread = Thread.create(board);
    const threadRepo = getCustomRepository(ThreadRepository);
    return await threadRepo.save(thread);
  };
  let threadsNumber: number = ALL_THREADS;
  // creates posts with id 1...ALL_THREADS
  while (threadsNumber !== 0) {
    const thread = await createOne();
    let postsNumber: number = 1;
    // creates posts with body #1...#POSTS_PER_THREAD
    while (postsNumber <= POSTS_PER_THREAD) {
      await replyToThread(board.slug, thread, postsNumber);
      postsNumber = postsNumber + 1;
    }
    threadsNumber = threadsNumber - 1;
  }
};

let app;
describe('Threads listing', () => {
  before(async () => {
    app = await ApplicationServer.connectDB().then(server => server.app);

    const boardRepo = getCustomRepository(BoardRepository);

    let board = new Board({ name: 'bred', slug: 'b' });
    board = await boardRepo.save(board);
    await createThreads(board);

    let board2 = new Board({ name: 'bred-plus', slug: 'bb' });
    board2 = await boardRepo.save(board2);
    await createThreads(board2);
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);
  });

  it('/b/ - returns threads only from this board', (done) => {
    supertest(app).get('/boards/b/threads')
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.threads.filter(t => t.posts[0].body !== 'b')).to.have.lengthOf(0);
        done();
      });
  });
  it('/bb/ - returns threads only from this board', (done) => {
    supertest(app).get('/boards/bb/threads')
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.threads.filter(t => t.posts[0].body !== 'bb')).to.have.lengthOf(0);
        done();
      });
  });
});
