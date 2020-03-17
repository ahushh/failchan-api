import chai, { assert } from 'chai';
import config from 'config';
import supertest from 'supertest';

import { Application } from 'express';
import fs from 'fs';
import { Container } from 'inversify';
import rimraf from 'rimraf';
import { ApplicationServer } from '../../../presentation/http/server';
import { getTestApplicationServer } from '../../../server.test';

const TEMP_DIR = config.get<string>('file.tmpDir');

let app: Application;
let container: Container;
let testApplicationServer: ApplicationServer;
let ATTACHMENT_TTL;

describe('Attachment creation', () => {
  before(async () => {
    testApplicationServer = await getTestApplicationServer;
    await testApplicationServer.connection.synchronize(true);

    app = testApplicationServer.app;
    container = testApplicationServer.container;

    ATTACHMENT_TTL = config.get<string>('attachment.ttl');
  });
  beforeEach(() => {
    rimraf.sync(TEMP_DIR);
    fs.mkdirSync(TEMP_DIR);
  });
  after(async () => {
    await testApplicationServer.connection.synchronize(true);
  });

  it('returns correct expiresAt field accurate to second', (done) => {
    supertest(app).post('/attachments')
      .attach('attachments', `${__dirname}/test-image.jpg`)
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body).to.include.keys(['expiresAt']);
        const expiresAt = (1000 * ATTACHMENT_TTL) + +new Date();
        chai.expect(Math.round(res.body.expiresAt / 1000)).to
          .be.equal(Math.round(expiresAt / 1000));
        done();
      });
  });
  it('stores file in a tmp subdir keeping original name', (done) => {
    supertest(app).post('/attachments')
      .attach('attachments', `${__dirname}/test-image.jpg`)
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body).to.include.keys(['uid']);
        fs.readdir(TEMP_DIR, (err, files) => {
          chai.expect(err).to.be.null;
          chai.expect(
            files.length,
          ).to.eq(1);
          fs.readdir(`${TEMP_DIR}/${files[0]}`, (err, files) => {
            chai.expect(err).to.be.null;
            chai.expect(
              files.length,
            ).to.eq(1);
            chai.expect(
              files[0],
            ).to.eq('test-image.jpg');
            done();
          });
        });
      });
  });
  it('clears uploaded file when it expires', (done) => {
    (config as any).attachment.ttl = 1;

    supertest(app).post('/attachments')
      .attach('attachments', `${__dirname}/test-image.jpg`)
      .end((err, res) => {
        chai.expect(res.status).to.eq(200);
        chai.expect(res.body).to.include.keys(['uid']);
        let watcher;
        watcher = fs.watch(TEMP_DIR, (eventType, filename) => {
          if (eventType !== 'rename') {
            return;
          }
          fs.readdir(TEMP_DIR, (err, files) => {
            chai.expect(err).to.be.null;
            chai.expect(
              files.length,
            ).to.eq(0);
            watcher.close();
            done();
          });
        });
      });
  });
  it('returns an error if file field does not match', (done) => {
    // Container.set(FileServiceFactory, Factory);
    supertest(app).post('/attachments')
      .attach('dudeweed', `${__dirname}/test-image.jpg`)
      .end((err, res) => {
        chai.expect(res.status).to.eq(422);
        chai.expect(res.body).to.have.keys(['name', 'message', 'details']);
        done();
      });
  });
});
