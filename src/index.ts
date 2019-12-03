#!/usr/bin/env node

import { createApplicationServer } from './server';

createApplicationServer().then((server) => {
  server.listen();
});
