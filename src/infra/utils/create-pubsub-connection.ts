import Redis from 'ioredis';
export interface IPubSubConnection {
  pub: {
    publish: any;
  };
  sub: {
    on: any;
    subscribe: any;
  };
}
export const createPubSubConnection = () => {
  const pub = new Redis(process.env.REDIS_URI);
  const sub = new Redis(process.env.REDIS_URI);
  return Promise.all([
    new Promise((resolve, reject) => pub.on('ready', () => resolve())),
    new Promise((resolve, reject) => sub.on('ready', () => resolve())),
  ]).then(() => ({ pub, sub }) as IPubSubConnection);
};
