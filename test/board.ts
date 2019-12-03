import chai from 'chai';
import supertest from 'supertest';

import { getCustomRepository, getRepository } from 'typeorm';
import { Board } from '../src/domain/entity/board';
import { BoardRepository } from '../src/infra/repository/board.repo';
import { getTestApplicationServer } from '../src/server.test';

let app;
let container;
let testApplicationServer;

describe('Boards listing', () => {
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    app = testApplicationServer.app;
    container = testApplicationServer.container;

    const board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    await repo.save(board);
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });

  it('returns list of boards', (done) => {
    supertest(app).get('/boards')
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.boards).to.have.lengthOf(1);
        chai.expect(res.body.boards[0]).to.include({
          slug: 'b',
          name: 'bred',
        });
        chai.expect(res.body.boards[0]).to.have.keys([
          'id', 'name', 'slug', 'createdAt', 'updatedAt',
        ]);
        done();
      });
  });
  it('creates a new board', (done) => {
    supertest(app).post('/boards')
      .send({ name: 'discuss', slug: 'd' })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.board).to.include({
          slug: 'd',
          name: 'discuss',
        });
        chai.expect(res.body.board).to.have.keys([
          'id', 'name', 'slug', 'createdAt', 'updatedAt',
        ]);
        done();
      });
  });
  it('does not allow to create a board with existing slug', (done) => {
    supertest(app).post('/boards')
      .send({ name: 'should fail', slug: 'b' })
      .end((err, res) => {
        chai.expect(res.status).to.eq(400);
        chai.expect(res.body).to.include({
          error: 'Board with such slug already exists',
        });
        done();
      });
  });
});
