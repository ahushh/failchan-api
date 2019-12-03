import chai from 'chai';
import { Application } from 'express';
import { Container } from 'inversify';
import supertest from 'supertest';
import { getCustomRepository } from 'typeorm';

import { IAction } from '../../../app/interfaces/action';
import { IOC_TYPE } from '../../../config/type';
import { Board } from '../../../domain/entity/board';
import { Thread } from '../../../domain/entity/thread';
import { BoardRepository } from '../../../infra/repository/board.repo';
import { ThreadRepository } from '../../../infra/repository/thread.repo';
import { ApplicationServer } from '../../../presentation/http/server';
import { getTestApplicationServer } from '../../../server.test';
import { replyToThreadFactory } from '../../support/reply-to-thread';

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Attachment and posts', () => {
  let uuid;
  let thread;

  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    let board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread);
    await replyToThreadFactory(container)(thread, 'op');

    const action: IAction = container.get(IOC_TYPE.CreateAttachmentAction);
    uuid = await action.execute([{
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
