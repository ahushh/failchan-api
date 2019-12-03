import chai from 'chai';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { PostService } from '../../src/app/service/post.service';
import { IOC_TYPE } from '../../src/config/type';
import { Board } from '../../src/domain/entity/board';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { getTestApplicationServer } from '../../src/server.test';

const replyToThread = container => async (thread, i: number) => {
  const postService = container.get(IOC_TYPE.PostService);
  const post = { body: `#${i}`, attachmentIds: [], references: [] };
  const request = { ...post, threadId: thread.id };
  await postService.replyToThread(request);
};
const createThread = container => async (board) => {
  let thread = Thread.create(board);
  const threadRepo = getCustomRepository(ThreadRepository);
  thread = await threadRepo.save(thread);
  await replyToThread(container)(thread, 1);
  await replyToThread(container)(thread, 2);
  await replyToThread(container)(thread, 3);
};

let app;
let container;
let testApplicationServer;
describe('Thread fetching', () => {
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    app = testApplicationServer.app;
    container = testApplicationServer.container;

    let board = new Board({ name: 'bred', slug: 'b' });
    const boardRepo = getCustomRepository(BoardRepository);
    board = await boardRepo.save(board);
    await createThread(container)(board);
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });

  it('returns thread with correct order of its posts', (done) => {
    supertest(app).get('/threads/1')
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        const thread = res.body.thread;
        chai.expect(thread.posts).to.have.lengthOf(3);
        chai.expect(thread.posts[0].body).to.eq('#1');
        chai.expect(thread.posts[1].body).to.eq('#2');
        chai.expect(thread.posts[2].body).to.eq('#3');
        done();
      });
  });
});
