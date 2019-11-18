import chai from 'chai';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';
import { CreateAttachmentAction } from '../../src/app/actions/attachments/create';
import { Board } from '../../src/domain/entity/board';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { ApplicationServer } from '../../src/presentation/http/server';
import { replyToThread } from '../post/update';

let app;

describe('Attachment and posts', () => {
  let uuid;
  let thread;

  before(async () => {
    app = await ApplicationServer.connectDB().then(server => server.app);

    let board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread);
    await replyToThread(thread, 'op');

    uuid = await new CreateAttachmentAction([{
      mimetype: 'image/jpeg',
      size: 1000,
      path: `${__dirname}/test-image.jpg`,
      originalname: 'test-image.jpg',
    }]).execute();
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);
  });
  it('attaches an attachment to the post', (done) => {
    supertest(app).post(`/threads/${thread.id}/posts`)
      .send({ post: { body: 'some text', attachment: uuid, referencies: [] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body.post.attachments).to.be.lengthOf(1);
        done();
      });
  });
});
