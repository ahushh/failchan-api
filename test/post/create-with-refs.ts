import chai from 'chai';
import supertest from 'supertest';
import Container from 'typedi';
import { getCustomRepository, getRepository } from 'typeorm';

import { ReplyToThreadCommand } from '../../src/app/commands/post';
import { PostService } from '../../src/app/service/post.service';
import { Board } from '../../src/domain/entity/board';
import { Post } from '../../src/domain/entity/post';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { ApplicationServer } from '../../src/server';

const replyToThread = async (thread, body, referencies = []) => {
  const postService = Container.get(PostService);
  const post = { body, referencies, attachmentIds: [] };
  const command = new ReplyToThreadCommand({ ...post, threadId: thread.id });
  return postService.replyToThreadHandler(command);
};

let app;

describe('Posts creation with referencies', () => {
  let thread;
  let board;
  before(async () => {
    app = await ApplicationServer.getApp();

    board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread);
    await replyToThread(thread, 'op');
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);
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
