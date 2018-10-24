import chai from 'chai';
import supertest from 'supertest';
import { ApplicationServer } from '../../src/server';
import { Board } from '../../src/domain/entity/board';
import { getCustomRepository } from 'typeorm';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { Thread } from '../../src/domain/entity/thread';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';

let app;

describe('Post create', () => {
  let thread;
  let board;
  before(async () => {
    app = await ApplicationServer.getApp();

    board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);
  });
  beforeEach(async () => {
    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread);
  });

  it('creates a new post and bumps thread', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ post: { body: 'should fail', attachments: [], referencies: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        const newThread = res.body.post.thread;
        chai.expect(newThread.bumpCount).to.eq(thread.bumpCount + 1);
        chai.expect(newThread.updatedAt).not.to.eq(thread.updatedAt);
        done();
      });
  });
  // it('does not allow to create a board with existing slug', (done) => {
  //   supertest(app).post(`/thread/${threadId}`)
  //     .send({ post: { name: 'should fail', slug: 'b' } })
  //     .end((err, res) => {
  //       chai.expect(res.status).to.eq(400);
  //       chai.expect(res.body).to.include({
  //         error: 'Board with such slug already exists',
  //       });
  //       done();
  //     });
  // });
});
