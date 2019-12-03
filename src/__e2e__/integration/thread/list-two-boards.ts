import chai from 'chai';
import { Application } from 'express';
import { Container } from 'inversify';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { PostService } from '../../../app/service/post.service';
import { IOC_TYPE } from '../../../config/type';
import { Board } from '../../../domain/entity/board';
import { Thread } from '../../../domain/entity/thread';
import { BoardRepository } from '../../../infra/repository/board.repo';
import { ThreadRepository } from '../../../infra/repository/thread.repo';
import { ApplicationServer } from '../../../presentation/http/server';
import { getTestApplicationServer } from '../../../server.test';
import { createManyThreadsFactory } from '../../support/create-many-threads';

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Threads listing', () => {
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    const boardRepo = getCustomRepository(BoardRepository);
    const createThreads = createManyThreadsFactory(container);

    let board = new Board({ name: 'bred', slug: 'b' });
    board = await boardRepo.save(board);
    await createThreads(board);

    let board2 = new Board({ name: 'bred-plus', slug: 'bb' });
    board2 = await boardRepo.save(board2);
    await createThreads(board2);
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
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
