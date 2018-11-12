import chai from 'chai';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { Board } from '../../src/domain/entity/board';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ApplicationServer } from '../../src/presentation/http/server';

describe.only('Threads creation', () => {
  let app;
  before(async () => {
    app = await ApplicationServer.connectDB().then(server => server.expressApplication);

    const repo = getCustomRepository(BoardRepository);

    const board = new Board({ name: 'bred', slug: 'b' });
    await repo.save(board);

    const board2 = new Board({ name: 'bred', slug: 'bb' });
    await repo.save(board2);
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);
  });

  const makeRequest = (board, body, done) => {
    supertest(app).post(`/boards/${board}/threads`)
    .send({ post: { body } })
    .end((err, res) => {
      chai.expect(res.status).to.eq(200);

      chai.expect(res.body.thread).to.have.keys([
        'id', 'bumpCount', 'posts', 'createdAt', 'updatedAt',
      ]);
      chai.expect(res.body.thread).to.include({
        bumpCount: 1,
      });
      chai.expect(res.body.thread.posts).to.have.lengthOf(1);
      chai.expect(res.body.thread.posts[0]).to.keys([
        'id', 'body', 'attachments', 'createdAt', 'updatedAt',
        'replies', 'referencies',
      ]);
      chai.expect(res.body.thread.posts[0]).to.include({
        body,
      });
      ['attachments', 'replies', 'referencies'].forEach((k: string) => {
        chai.expect(res.body.thread.posts[0][k]).to.have.lengthOf(0);
      });
      done();
    });
  };

  it('creates a new thread', (done) => {
    makeRequest('b', 'new message', done);
  });
  it('creates two threads on the same board in a row', (done) => {
    makeRequest('b', 'first thread', () => {
      makeRequest('b', 'second thread', done);
    });
  });
  it('creates two threads on different boards', (done) => {
    makeRequest('b', 'first thread', () => {
      makeRequest('bb', 'second thread', done);
    });
  });

  it('shows an error if trying to create a thread on non existing board', () => {
    supertest(app).post('/boards/d/threads')
    .send({ post: { body: 'some message' } })
    .end((err, res) => {
      chai.expect(res.status).to.eq(404);
      chai.expect(res.body).to.include({
        message: 'Board d not found',
      });
    });
  });
});
