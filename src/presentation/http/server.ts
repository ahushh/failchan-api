#!/usr/bin/env node

require('dotenv').config();

import { Connection } from 'typeorm';

import app from './app';
const debug = require('debug')('express:server');
import { Express } from 'express-serve-static-core';
import http from 'http';
import { createORMConnection } from '../../infra/create-orm-connection';
import { createPubSubConnection } from '../../infra/create-pubsub-connection';
import { createRedisConnection } from '../../infra/create-redis-connection';

class Server {
  expressApplication: Express;
  private port: any;
  server: http.Server;
  connection: Connection;

  private createORMConnection: () => Connection;
  private createHttpServer: (app: Express) => http.Server;
  private createRedisConnection = () => Promise;
  private createPubSubConnection = () => Promise;

  constructor({
    createORMConnection,
    createRedisConnection,
    createPubSubConnection,
    createHttpServer,
    expressApplication,
    port,
  }) {
    this.createHttpServer = createHttpServer;
    this.createRedisConnection = createRedisConnection;
    this.createPubSubConnection = createPubSubConnection;
    this.createORMConnection = createORMConnection;
    this.expressApplication = expressApplication;
    this.port = port;
    this.expressApplication.set('port', this.port);
  }

  async connectDB() {
    if (!this.connection) {
      this.connection = await this.createORMConnection();
    }
    await this.createRedisConnection();
    await this.createPubSubConnection();
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

// tslint:disable-next-line:variable-name
export const ApplicationServer = new Server({
  createORMConnection,
  createRedisConnection,
  createPubSubConnection,
  createHttpServer: http.createServer,
  expressApplication: app,
  port: process.env.PORT || '3000',
});
