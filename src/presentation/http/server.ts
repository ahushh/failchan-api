require('dotenv').config();
const debug = require('debug')('express:server');

import { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { configAppFactory, errorConfigAppFactory } from './express';

import { FailchanApp } from '../../app/app';
import { container } from '../../container';
import { createORMConnection } from '../../infra/utils/create-orm-connection';
import { createPubSubConnection } from '../../infra/utils/create-pubsub-connection';
import { createRedisConnection } from '../../infra/utils/create-redis-connection';

class Server {
  private port: any;
  private server: InversifyExpressServer;
  private failchan: FailchanApp;

  app: Application;

  get connection() {
    return this.failchan.connection;
  }

  constructor({
    createFailchan,
    createHttpServer,
    port,
  }) {
    this.port = port;
    const config = configAppFactory({ port: this.port });
    const errorConfig = errorConfigAppFactory();

    this.app = createHttpServer()
      .setConfig(config)
      .setErrorConfig(errorConfig)
      .build();

    this.failchan = createFailchan();
  }

  async connectDB() {
    await this.failchan.connectDB();
    return this;
  }

  listen() {
    this.app.listen(this.port);
    this.app.on('error', this.onError);
    this.app.on('listening', this.onListening);
  }

  private onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.port === 'string'
      ? `Pipe ${this.port}`
      : `Port ${this.port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  private onListening = () => {
    debug(`Listening on ${this.port}`);
  }
}

// tslint:disable-next-line:variable-name
export const ApplicationServer = new Server({
  createFailchan: () => FailchanApp.create({
    createORMConnection,
    createPubSubConnection,
    createRedisConnection,
  }),
  createHttpServer: () => new InversifyExpressServer(container),
  port: process.env.PORT || '3000',
});
