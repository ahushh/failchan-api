import chai from 'chai';
import { Application } from 'express';
import { Container } from 'inversify';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { Board } from '../../../domain/entity/board';
import { BoardRepository } from '../../../infra/repository/board.repo';
import { ThreadRepository } from '../../../infra/repository/thread.repo';
import { ApplicationServer } from '../../../presentation/http/server';
import { getTestApplicationServer } from '../../../server.test';
import { createThreadFactory } from '../../support/create-thread';

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Thread fetching', () => {
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    let board = new Board({ name: 'bred', slug: 'b' });
    const boardRepo = getCustomRepository(BoardRepository);
    board = await boardRepo.save(board);
    await createThreadFactory(container)(board);
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
        chai.expect(thread.posts[0].body).to.eq('1');
        chai.expect(thread.posts[1].body).to.eq('2');
        chai.expect(thread.posts[2].body).to.eq('3');
        done();
      });
  });
});
