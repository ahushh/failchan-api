import Redis from 'ioredis';
import Container from 'typedi';

export const createRedisConnection = () => {
  const connection = new Redis(process.env.REDIS_URI);
  Container.set('redis-connection', connection);
  return new Promise((resolve, reject) => {
    connection.on('ready', () => {
      connection.config('SET', 'notify-keyspace-events', 'Ex');
    });
    resolve();
  });
};
