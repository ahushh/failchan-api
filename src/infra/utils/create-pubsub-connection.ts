import config from 'config';
import Redis from 'ioredis';

import { IPubSubConnection } from '../../app/interfaces/IPubSubConnection';

export const createPubSubConnection = () => {
  const options = {
    host: config.get<string>('redis.host'),
    port: config.get<number>('redis.port'),
  };
  const pub = new Redis(options);
  const sub = new Redis(options);
  return Promise.all([
    new Promise((resolve, reject) => pub.on('ready', () => resolve())),
    new Promise((resolve, reject) => sub.on('ready', () => resolve())),
  ]).then(() => ({ pub, sub }) as IPubSubConnection);
};
