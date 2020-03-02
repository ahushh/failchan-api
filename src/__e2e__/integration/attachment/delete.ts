import { exec } from 'child_process';
import { promisify } from 'util';

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
import { CreatePostAction } from '../../../presentation/actions/post/create';

const testFileDir = `${__dirname}/test`;
const originalFilePath = `${__dirname}/test-image.jpg`;
const testFilePath = `${testFileDir}/test-image.jpg`;

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;

describe('Attachment deletion', () => {
  let uuid;
  let thread;
  let attachmentId;
  let token;

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
    const data = await replyToThreadFactory(container)(thread, 'op');
    token = data.token;

    try {
      await promisify(exec)(`mkdir ${testFileDir} && cp ${originalFilePath} ${testFilePath}`);
    } catch (e) {

    }

    const action: IAction = container.get(IOC_TYPE.CreateAttachmentAction);
    const response = await action.execute([{
      mimetype: 'image/jpeg',
      size: 1000,
      path: testFilePath,
      originalname: 'test-image.jpg',
    }]);
    uuid = response.uid;

    const createPost: CreatePostAction = container.get(IOC_TYPE.CreatePostAction);
    const createPostResponse = await createPost.execute({
      token,
      body: 'body',
      attachment: uuid,
      references: [],
      threadId: thread.id,
    });
    attachmentId = createPostResponse.post.attachments[0].id;
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });
  it('throws an error trying to delete an attachment using a malformed token', (done) => {
    supertest(app).delete('/attachments')
      .query({ token: 'fail', ids: [attachmentId] })
      .end((err, res) => {
        chai.expect(res.status).to.eq(403);
        chai.expect(res.body).to.include({
          name: 'InvalidToken',
        });
        done();
      });
  });
  it('deletes an attachment', (done) => {
    supertest(app).delete('/attachments')
      .query({ token, ids: [attachmentId] })
      .end((err, res) => {
        chai.expect(res.status).to.eq(204);
        done();
      });
  });
});
