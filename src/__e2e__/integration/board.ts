import chai from 'chai';
import supertest from 'supertest';

import { Application } from 'express';
import { Container } from 'inversify';
import { getCustomRepository, getRepository } from 'typeorm';
import { Board } from '../../domain/entity/board';
import { BoardRepository } from '../../infra/repository/board.repo';
import { ApplicationServer } from '../../presentation/http/server';
import { getTestApplicationServer } from '../../server.test';

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Boards listing', () => {
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

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
