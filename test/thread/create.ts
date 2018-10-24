import chai from 'chai';
import supertest from 'supertest';
import { Container } from 'typedi';
import { Board } from '../../src/domain/entity/board';
import { getCustomRepository, getRepository } from 'typeorm';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ApplicationServer } from '../../src/server';
import { Post } from '../../src/domain/entity/post';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';

describe('Threads creation', () => {
  let app;
  before(async () => {
    app = await ApplicationServer.getApp();

    const board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    await repo.save(board);
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);

  });

  it('creates a new thread', (done) => {
    supertest(app).post('/boards/b/threads')
      .send({ post: { body: 'some message' } })
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
          body: 'some message',
        });
        ['attachments', 'replies', 'referencies'].forEach(k => {
          chai.expect(res.body.thread.posts[0][k]).to.have.lengthOf(0);
        });
        done();
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
