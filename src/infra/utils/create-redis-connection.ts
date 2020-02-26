import Redis from 'ioredis';

export interface IRedisConnection {

}
export const createRedisConnection = () => {
  const connection = new Redis({
    host: process.env.REDIS_HOST as string,
    port: +(process.env.REDIS_PORT as string),
  });
  return new Promise<IRedisConnection>((resolve, reject) => {
    connection.on('ready', () => {
      connection.config('SET', 'notify-keyspace-events', 'Ex');
    });
    resolve(connection);
  });
};
