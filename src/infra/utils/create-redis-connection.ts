import config from 'config';
import Redis from 'ioredis';

export interface IRedisConnection {

}
export const createRedisConnection = () => {
  const connection = new Redis({
    host: config.get<string>('redis.host'),
    port: config.get<number>('redis.port'),
  });
  return new Promise<IRedisConnection>((resolve, reject) => {
    connection.on('ready', () => {
      connection.config('SET', 'notify-keyspace-events', 'Ex');
    });
    resolve(connection);
  });
};
