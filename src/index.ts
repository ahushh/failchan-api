#!/usr/bin/env node

import fs from 'fs';
import 'reflect-metadata';

import { InversifyExpressServer } from 'inversify-express-utils';
import { IOC_TYPE } from './config/type';
import { createContainer } from './container';
import { ApplicationServer } from './presentation/http/server';

const tmpDir = process.env.TEMP_DIR as string;
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

createContainer().then((container) => {
  new ApplicationServer({
    port: process.env.PORT || 3000,
    createHttpServer: () => new InversifyExpressServer(container),
    connection: container.get(IOC_TYPE.ORMConnection),
    // tslint:disable-next-line: object-shorthand-properties-first
    container,
  }).listen();
});
