import chai from 'chai';
import { Application } from 'express';
import { Container } from 'inversify';
import supertest from 'supertest';
import { getCustomRepository, getRepository } from 'typeorm';
import { IOC_TYPE } from '../../../config/type';
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

describe('Posts updating', () => {
  let thread;
  let board;
  let token;
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread); // 1
    const replyToThread = replyToThreadFactory(container);

    try {
      const result = await replyToThread(thread, 'op'); // id 1
      token = result.token;

      await replyToThread(thread, 'reply 1', [], token); // id 2
      await replyToThread(thread, 'reply 2', [1], token); // id 3
      await replyToThread(thread, 'reply 3', [], token); // id 4
      await replyToThread(thread, 'reply 4', [], token); // id 5
      await replyToThread(thread, 'reply 5', [5], token); // id 6
    } catch (e) {
      console.log('Error before: ', e);
    }
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });

  it('does not allow to update post using incorrect token', (done) => {
    supertest(app).patch('/posts/1')
      .send({ post: { body: 'new body' }, token: 'shouldfail' })
      .end((err, res) => {
        chai.expect(res.status).to.eq(403);
        chai.expect(res.body).to.include({
          error: 'Supplied token is invalid',
        });
        done();
      });
  });
  it('updates post with new body correctly', (done) => {
    supertest(app).patch('/posts/1')
      .send({ post: { body: 'new body' }, token })
      .end((err, res) => {
        chai.expect(res.status).to.eq(204);
        const repo = getRepository(Post);
        repo.findOne(1).then((post) => {
          // tslint:disable-next-line:no-parameter-reassignment
          post = post as Post;
          chai.expect(post).not.to.be.undefined;
          chai.expect(post.body).to.eq('new body');
          done();
        }).catch(done);
      });
  });
  it('updates post by replacing all references', (done) => {
    supertest(app).patch('/posts/3')
      .send({ post: { references: [2] }, token })
      .end((err, res) => {
        chai.expect(res.status).to.eq(204);
        const repo = getRepository(Post);
        repo.findOne(3, {
          relations: ['references'],
        }).then((post) => {
          // tslint:disable-next-line:no-parameter-reassignment
          post = post as Post;
          chai.expect(post).not.to.be.undefined;
          chai.expect(post.references).to.have.lengthOf(1);
          chai.expect(post.references[0].id).to.be.eq(2);
          done();
        }).catch(done);
      });
  });
  it(
    'correctly updates replies of removed and added references',
    (done) => {
      supertest(app).patch('/posts/6')
        .send({ post: { references: [4] }, token })
        .end((err, res) => {
          chai.expect(res.status).to.eq(204);
          const repo = getRepository(Post);
          // old refs are cleared
          repo.findOne(5, {
            relations: ['replies'],
          }).then((post) => {
            // tslint:disable-next-line:no-parameter-reassignment
            post = post as Post;
            chai.expect(post).not.to.be.undefined;
            chai.expect(post.replies).to.have.lengthOf(0);

            // new ref's replies are updated
            repo.findOne(4, {
              relations: ['replies'],
            }).then((post) => {
              // tslint:disable-next-line:no-parameter-reassignment
              post = post as Post;
              chai.expect(post).not.to.be.undefined;
              chai.expect(post.replies).to.have.lengthOf(1);
              chai.expect(post.replies[0].id).to.eq(6);
              done();
            }).catch(done);
          }).catch(done);
        });
    });
});
