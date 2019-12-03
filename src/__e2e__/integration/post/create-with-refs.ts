import chai from 'chai';
import supertest from 'supertest';
import { getCustomRepository, getRepository } from 'typeorm';

import { Application } from 'express';
import { Container } from 'inversify';
import { Board } from '../../../domain/entity/board';
import { Post } from '../../../domain/entity/post';
import { Thread } from '../../../domain/entity/thread';
import { BoardRepository } from '../../../infra/repository/board.repo';
import { ThreadRepository } from '../../../infra/repository/thread.repo';
import { ApplicationServer } from '../../../presentation/http/server';
import { getTestApplicationServer } from '../../../server.test';
import { replyToThreadFactory } from '../../support/reply-to-thread';

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Posts creation with references', () => {
  let thread;
  let board;
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread);
    const replyToThread = replyToThreadFactory(container);
    await replyToThread(thread, 'op');
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });

  it('creates a new post with 1 reference correctly', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ post: { body: 'with ref', attachments: [], references: [1] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        const post = res.body.post;
        chai.expect(post.references).to.have.lengthOf(1);
        chai.expect(post.references[0]).to.include({
          body: 'op',
          id: 1,
        });
        // reply correctly attached to the ref
        const repo = getRepository(Post);
        repo.findOne(1, { relations: ['replies'] }).then((opPost) => {
          chai.expect(opPost).to.be.not.undefined;
          chai.expect((<Post>opPost).replies).to.exist;
          chai.expect((<Post>opPost).replies).to.have.lengthOf(1);
          chai.expect((<Post>opPost).replies[0].body).to.eq('with ref');
          done();
        }).catch(done);

      });
  });
});
