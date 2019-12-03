import chai from 'chai';
import supertest from 'supertest';
import { getCustomRepository, getRepository } from 'typeorm';

import { Board } from '../../src/domain/entity/board';
import { Post } from '../../src/domain/entity/post';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { getTestApplicationServer } from '../../src/server.test';
import { replyToThreadFactory } from './update';

let app;
let container;
let testApplicationServer;
describe('Posts creation with referencies', () => {
  let thread;
  let board;
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
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
      .send({ post: { body: 'with ref', attachments: [], referencies: [1] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        const post = res.body.post;
        chai.expect(post.referencies).to.have.lengthOf(1);
        chai.expect(post.referencies[0]).to.include({
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
