#!/usr/bin/env node

import config from 'config';
import 'reflect-metadata';

import { InversifyExpressServer } from 'inversify-express-utils';
import { createContainer } from './config/container';
import { IOC_TYPE } from './config/type';
import { ApplicationServer } from './presentation/http/server';

export const createApplicationServer = async () => {
  const container = await createContainer();
  return new ApplicationServer({
    port: config.get<number>('server.port') || 3000,
    createHttpServer: () => new InversifyExpressServer(container),
    connection: container.get(IOC_TYPE.ORMConnection),
    // tslint:disable-next-line: object-shorthand-properties-first
    container,
  });
};
