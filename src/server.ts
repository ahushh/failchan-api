#!/usr/bin/env node

require('dotenv').config();

import { createConnection, useContainer, getConnectionOptions } from 'typeorm';
import { Container } from 'typedi';

import app from './presentation/app';
const debug = require('debug')('express:server');
import http from 'http';

class Server {
  app: any;
  port: any;
  server: any;
  constructor(app) {
    this.app = app;
    this.port = this.normalizePort(process.env.PORT || '3000');
    app.set('port', this.port);
    this.server = http.createServer(this.app);
  }
  async start() {
    useContainer(Container);
    await this.createTypeOrmConnection();
    this.server.listen(this.port);
    this.server.on('error', this.onError);
    this.server.on('listening', this.onListening);
  }

  private async createTypeOrmConnection() {
    const options = await getConnectionOptions(<string>process.env.NODE_ENV);
    return createConnection({ ...options, name: 'default' });
  }

  private normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
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

export const createServer = () => new Server(app);
