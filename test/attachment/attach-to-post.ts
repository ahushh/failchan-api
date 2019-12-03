import chai from 'chai';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { IOC_TYPE } from '../../src/config/type';
import { Board } from '../../src/domain/entity/board';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { getTestApplicationServer } from '../../src/server.test';
import { replyToThreadFactory } from '../post/update';

let app;
let container;
let testApplicationServer;

describe('Attachment and posts', () => {
  let uuid;
  let thread;

  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    app = testApplicationServer.app;
    container = testApplicationServer.container;

    let board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread);
    await replyToThreadFactory(container)(thread, 'op');

    uuid = await container.get(IOC_TYPE.CreateAttachmentAction).execute([{
      mimetype: 'image/jpeg',
      size: 1000,
      path: `${__dirname}/test-image.jpg`,
      originalname: 'test-image.jpg',
    }]);
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });
  it('attaches an attachment to the post', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ post: { body: 'some text', attachment: uuid, references: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.post.attachments).to.be.lengthOf(1);
        done();
      });
  });
});
