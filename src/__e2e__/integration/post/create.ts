import chai from 'chai';
import { Application } from 'express';
import { Container } from 'inversify';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { Board } from '../../../domain/entity/board';
import { Thread } from '../../../domain/entity/thread';
import { BoardRepository } from '../../../infra/repository/board.repo';
import { ThreadRepository } from '../../../infra/repository/thread.repo';
import { ApplicationServer } from '../../../presentation/http/server';
import { getTestApplicationServer } from '../../../server.test';
import { Author } from '../../../domain/entity/author';
import { AuthorRepository } from '../../../infra/repository/author.repo';

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Posts creation', () => {
  let thread;
  let board;
  let token;
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    const author = new Author();
    const authorRepo = getCustomRepository(AuthorRepository);
    await authorRepo.save(author);
    token = author.generateToken();
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });
  beforeEach(async () => {
    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread);
  });
  it('creates a new post and generates a new token', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ post: { body: 'should not fail', attachments: [], references: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.token).not.to.be.empty;
        done();
      });
  });
  it('creates a new post using an existing token, new token is not returned', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ token, post: { body: 'should not fail', attachments: [], references: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.token).not.to.exist;
        done();
      });
  });
  it('returns an error trying to create a new post using an invalid token', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ token: 'shouldfail', post: { body: 'should not fail', attachments: [], references: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(400);
        chai.expect(res.body).to.include({
          error: 'Supplied token is invalid',
        });       
        done();
      });
  });
  it('creates a new post and bumps thread', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ post: { body: 'should not fail', attachments: [], references: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        const repo = getCustomRepository(ThreadRepository);
        repo.findOne(thread.id).then((newThread) => {
          // tslint:disable-next-line:no-parameter-reassignment
          newThread = newThread as Thread;
          chai.expect(newThread).not.to.be.undefined;
          chai.expect(newThread.bumpCount).to.eq(thread.bumpCount + 1);
          chai.expect(newThread.updatedAt).not.to.eq(thread.updatedAt);
          done();
        }).catch(done);
      });
  });
  it('does not allow to reply to non-existent thread', (done) => {
    supertest(app).post('/threads/666/posts')
      .send({ post: { body: 'should fail', attachments: [], references: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(404);
        chai.expect(res.body).to.include({
          error: 'Thread 666 not found',
        });
        done();
      });
  });
});
