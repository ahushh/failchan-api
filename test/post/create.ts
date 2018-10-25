import chai from 'chai';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { Board } from '../../src/domain/entity/board';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { ApplicationServer } from '../../src/server';

let app;

describe('Posts creation', () => {
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
      .send({ post: { body: 'should not fail', attachments: [], referencies: [] } })
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
  it('does not allow to create a board with existing slug', (done) => {
    supertest(app).post('/threads/666/posts')
      .send({ post: { body: 'should fail', attachments: [], referencies: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(404);
        chai.expect(res.body).to.include({
          error: 'Thread 666 not found',
        });
        done();
      });
  });
});
