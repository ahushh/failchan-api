import Redis from 'ioredis';

export interface IRedisConnection {

}
export const createRedisConnection = () => {
  const connection = new Redis(process.env.REDIS_URI);
  return new Promise<IRedisConnection>((resolve, reject) => {
    connection.on('ready', () => {
      connection.config('SET', 'notify-keyspace-events', 'Ex');
    });
    resolve(connection);
  });
};
