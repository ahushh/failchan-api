import Redis from 'ioredis';
import { IPubSubConnection } from '../../app/interfaces/IPubSubConnection';
export const createPubSubConnection = () => {
  const pub = new Redis({
    host: process.env.REDIS_HOST as string,
    port: +(process.env.REDIS_PORT as string),
  });
  const sub = new Redis({
    host: process.env.REDIS_HOST as string,
    port: +(process.env.REDIS_PORT as string),
  });
  return Promise.all([
    new Promise((resolve, reject) => pub.on('ready', () => resolve())),
    new Promise((resolve, reject) => sub.on('ready', () => resolve())),
  ]).then(() => ({ pub, sub }) as IPubSubConnection);
};
