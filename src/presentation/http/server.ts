require('dotenv').config();
const debug = require('debug')('express:server');

import { Application } from 'express';
import { IORMConnection } from '../../infra/utils/create-orm-connection';
import { checkTmpDir } from '../utils/check-tmp-dir';
import { configAppFactory, errorConfigAppFactory } from './express';
import { Container } from 'inversify';

export class ApplicationServer {
  private port: any;
  connection: IORMConnection;

  app: Application;
  container: Container;

  constructor({
    createHttpServer,
    port,
    connection,
    container,
  }) {
    checkTmpDir();

    this.container = container;
    this.port = port;
    this.connection = connection;
    const config = configAppFactory({ port: this.port });
    const errorConfig = errorConfigAppFactory();

    this.app = createHttpServer()
      .setConfig(config)
      .setErrorConfig(errorConfig)
      .build();
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
