require('dotenv').config();

import app from './app';
const debug = require('debug')('express:server');
import { Express } from 'express-serve-static-core';
import http from 'http';
import { FailchanApp } from '../../app/app';

class Server {
  private port: any;
  private server: http.Server;
  private createHttpServer: (app: Express) => http.Server;
  private application: FailchanApp;

  expressApplication: Express;

  get connection() {
    return this.application.connection;
  }

  constructor({
    application,
    createHttpServer,
    expressApplication,
    port,
  }) {
    this.createHttpServer = createHttpServer;
    this.application = application;
    this.expressApplication = expressApplication;
    this.port = port;
    this.expressApplication.set('port', this.port);
  }

  async connectDB() {
    await this.application.connectDB();
    return this;
  }
  listen() {
    this.server = this.createHttpServer(this.expressApplication);
    this.server.listen(this.port);
    this.server.on('error', this.onError);
    this.server.on('listening', this.onListening);
  }

  set normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      this.port = val;
    }
    if (port >= 0) {
      // port number
      this.port = port;
    }
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
    const addr = this.server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }
}

const application = new FailchanApp.create();

// tslint:disable-next-line:variable-name
export const ApplicationServer = new Server({
  application,
  createHttpServer: http.createServer,
  expressApplication: app,
  port: process.env.PORT || '3000',
});
