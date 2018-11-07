import Redis from 'ioredis';
import Container from 'typedi';

export const createPubSubConnection = () => {
  const pub = new Redis(process.env.REDIS_URI);
  const sub = new Redis(process.env.REDIS_URI);
  Container.set('pubsub-connection', { pub, sub });
  return Promise.all([
    new Promise((resolve, reject) => pub.on('ready', () => resolve())),
    new Promise((resolve, reject) => sub.on('ready', () => resolve())),
  ]);
};
