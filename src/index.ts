#!/usr/bin/env node

import fs from 'fs';
import 'reflect-metadata';

import { ApplicationServer } from './presentation/http/server';

const tmpDir = process.env.TEMP_DIR as string;
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

ApplicationServer.connectDB()
  .then((server) => {
    server.listen();
  });
