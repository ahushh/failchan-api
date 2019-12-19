import chai from 'chai';
import { Application } from 'express';
import { Container } from 'inversify';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { ListThreadsByBoardAction } from '../../../presentation/actions/thread/list';
import { Board } from '../../../domain/entity/board';
import { BoardRepository } from '../../../infra/repository/board.repo';
import { ApplicationServer } from '../../../presentation/http/server';
import { getTestApplicationServer } from '../../../server.test';
import { createManyThreadsFactory } from '../../support/create-many-threads';

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Threads listing', () => {
  const ALL_THREADS = 20;
  const POSTS_PER_THREAD = 10;

  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    const createThreads = createManyThreadsFactory(
      container,
      ALL_THREADS,
      POSTS_PER_THREAD,
      'index',
    );
    let board = new Board({ name: 'bred', slug: 'b' });
    const boardRepo = getCustomRepository(BoardRepository);
    board = await boardRepo.save(board);
    await createThreads(board);
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });

  it('returns first page with correct status and quantity of threads', (done) => {
    supertest(app).get('/boards/b/threads')
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.threads).to.have.lengthOf(
          ListThreadsByBoardAction.TEST_THREADS_LISTING_TAKE,
        );
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
  it('returns first page with correct quantity of preview posts and correct order', (done) => {
    supertest(app).get('/boards/b/threads')
      .end((err, res) => {
        const checkThread = (index: number) => {
          const posts = res.body.threads[index].posts;
          chai.expect(posts)
            .to.have.lengthOf(
              ListThreadsByBoardAction.TEST_THREADS_LISTING_PREVIEW_POSTS + 1,
            ); // plus OP post
          chai.expect(posts[2].body).to.eq(`#${POSTS_PER_THREAD}`);
          chai.expect(posts[1].body).to.eq(`#${POSTS_PER_THREAD - 1}`);
        };
        checkThread(0);
        checkThread(1);
        done();
      });
  });
  it('returns second page with correct threads by IDs', (done) => {
    const url = `/boards/b/threads?skip=${ListThreadsByBoardAction.TEST_THREADS_LISTING_TAKE}`;
    supertest(app).get(url)
      .end((err, res) => {
        chai.expect(res.body.threads[0].id).to
          .eq(ALL_THREADS - ListThreadsByBoardAction.TEST_THREADS_LISTING_TAKE);
        chai.expect(res.body.threads[1].id).to
          .eq(ALL_THREADS - ListThreadsByBoardAction.TEST_THREADS_LISTING_TAKE - 1);
        done();
      });
  });
});
