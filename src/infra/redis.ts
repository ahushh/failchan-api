// import redis, { RedisClient } from 'redis';
// import { Service } from 'typedi';

// @Service()
// export class RedisConnection {
//   client: RedisClient;
//   constructor() {
//     this.client = redis.createClient({
//       port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
//       db: 'attachments',
//     });
//     this.client.on('error', (err) => {
//       throw new Error(`Redis connection error: ${err}`);
//     });
//   }
// }
