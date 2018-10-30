import chai from 'chai';
import supertest from 'supertest';
import { Container } from 'typedi';
import { getCustomRepository, getRepository } from 'typeorm';
import { ReplyToThreadCommand } from '../../src/app/commands/post';
import { PostService } from '../../src/app/service/post.service';
import { Board } from '../../src/domain/entity/board';
import { Post } from '../../src/domain/entity/post';
import { Thread } from '../../src/domain/entity/thread';
import { BoardRepository } from '../../src/infra/repository/board.repo';
import { ThreadRepository } from '../../src/infra/repository/thread.repo';
import { ApplicationServer } from '../../src/server';

export const replyToThread = async (thread, body, referencies: number[] = []) => {
  const postService = Container.get(PostService);
  const post = { body, referencies, attachmentIds: [] };
  const command = new ReplyToThreadCommand({ ...post, threadId: thread.id });
  return postService.replyToThreadHandler(command);
};

let app;

describe('Posts updating', () => {
  let thread;
  let board;
  before(async () => {
    app = await ApplicationServer.getApp();

    board = new Board({ name: 'bred', slug: 'b' });
    const repo = getCustomRepository(BoardRepository);
    board = await repo.save(board);

    thread = Thread.create(board);
    thread = await getCustomRepository(ThreadRepository).save(thread); // 1
    await replyToThread(thread, 'op'); // id 1
    await replyToThread(thread, 'reply 1', []); // id 2
    await replyToThread(thread, 'reply 2', [1]); // id 3
    await replyToThread(thread, 'reply 3', []); // id 4
    await replyToThread(thread, 'reply 4', []); // id 5
    await replyToThread(thread, 'reply 5', [5]); // id 6
  });
  after(async () => {
    await ApplicationServer.connection.synchronize(true);
  });

  it('updates post with new body correctly', (done) => {
    supertest(app).patch('/posts/1')
      .send({ post: { body: 'new body' } })
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
  it('updates post by replacing all referencies', (done) => {
    supertest(app).patch('/posts/3')
      .send({ post: { referencies: [2] } })
      .end((err, res) => {
        chai.expect(res.status).to.eq(204);
        const repo = getRepository(Post);
        repo.findOne(3, {
          relations: ['referencies'],
        }).then((post) => {
          // tslint:disable-next-line:no-parameter-reassignment
          post = post as Post;
          chai.expect(post).not.to.be.undefined;
          chai.expect(post.referencies).to.have.lengthOf(1);
          chai.expect(post.referencies[0].id).to.be.eq(2);
          done();
        }).catch(done);
      });
  });
  it(
    'correctly updates replies of removed and added referencies',
    (done) => {
      supertest(app).patch('/posts/6')
        .send({ post: { referencies: [4] } })
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