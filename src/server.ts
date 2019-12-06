#!/usr/bin/env node

import 'reflect-metadata';

import { InversifyExpressServer } from 'inversify-express-utils';
import { IOC_TYPE } from './config/type';
import { createContainer } from './config/container';
import { ApplicationServer } from './presentation/http/server';

export const createApplicationServer = async () => {
  const container = await createContainer();
  return new ApplicationServer({
    port: process.env.PORT || 3000,
    createHttpServer: () => new InversifyExpressServer(container),
    connection: container.get(IOC_TYPE.ORMConnection),
    // tslint:disable-next-line: object-shorthand-properties-first
    container,
  });
};
