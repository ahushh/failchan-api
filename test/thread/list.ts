import chai from 'chai';
import supertest from 'supertest';
import { Container } from 'typedi';
import { getConnection, getCustomRepository, getRepository } from 'typeorm';
import { ReplyToThreadCommand } from '../../src/app/commands/post';
import {
  TEST_THREADS_LISTING_PREVIEW_POSTS,
  TEST_THREADS_LISTING_TAKE,
} from '../../src/app/commands/thread';
import { PostService } from '../../src/app/service/post.service';
import { Board } from '../../src/domain/entity/board';
import { Post } from '../../src/domain/entity/post';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { ApplicationServer } from '../../src/server';

const ALL_THREADS = 20;
const POSTS_PER_THREAD = 10;

const replyToThread = async (thread, i: number) => {
  const postService = Container.get(PostService);
  const post = { body: `#${i}`, attachmentIds: [], referencies: [] };
  const command = new ReplyToThreadCommand({ ...post, threadId: thread.id });
  await postService.replyToThreadHandler(command);
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
      await replyToThread(thread, postsNumber);
      postsNumber = postsNumber + 1;
    }
    threadsNumber = threadsNumber - 1;
  }
};

let app;
describe('Threads listing', () => {
  before(async () => {
    app = await ApplicationServer.getApp();

    let board = new Board({ name: 'bred', slug: 'b' });
    const boardRepo = getCustomRepository(BoardRepository);
    board = await boardRepo.save(board);
    await createThreads(board);
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);
  });

  it('returns first page with correct status and quantity of threads', (done) => {
    supertest(app).get('/boards/b/threads')
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.threads).to.have.lengthOf(TEST_THREADS_LISTING_TAKE);
        done();
      });
  });
  it('returns first page with two last threads by IDS', (done) => {
    supertest(app).get('/boards/b/threads')
      .end((err, res) => {
        chai.expect(res.body.threads[0].id).to.eq(ALL_THREADS);
        chai.expect(res.body.threads[1].id).to.eq(ALL_THREADS - 1);
        done();
      });
  });
  it('returns first page with correct OP posts', (done) => {
    supertest(app).get('/boards/b/threads')
      .end((err, res) => {
        const checkThread = (index: number) => {
          const posts = res.body.threads[index].posts;
          chai.expect(posts[0].body).to.eq('#1');
        };
        checkThread(0);
        checkThread(1);
        done();
      });
  });
  it('returns first page with correct quantity of preview posts and corret order', (done) => {
    supertest(app).get('/boards/b/threads')
      .end((err, res) => {
        const checkThread = (index: number) => {
          const posts = res.body.threads[index].posts;
          chai.expect(posts)
            .to.have.lengthOf(TEST_THREADS_LISTING_PREVIEW_POSTS + 1); // plus OP post
          chai.expect(posts[2].body).to.eq(`#${POSTS_PER_THREAD}`);
          chai.expect(posts[1].body).to.eq(`#${POSTS_PER_THREAD - 1}`);
        };
        checkThread(0);
        checkThread(1);
        done();
      });
  });
  it('returns second page with correct threads by IDs', (done) => {
    supertest(app).get(`/boards/b/threads?skip=${TEST_THREADS_LISTING_TAKE}`)
      .end((err, res) => {
        chai.expect(res.body.threads[0].id).to.eq(ALL_THREADS - TEST_THREADS_LISTING_TAKE);
        chai.expect(res.body.threads[1].id).to.eq(ALL_THREADS - TEST_THREADS_LISTING_TAKE - 1);
        done();
      });
  });
});