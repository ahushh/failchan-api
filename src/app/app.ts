import { Connection } from 'typeorm';
import { createORMConnection } from '../infra/utils/create-orm-connection';
import { createPubSubConnection } from '../infra/utils/create-pubsub-connection';
import { createRedisConnection } from '../infra/utils/create-redis-connection';

export class FailchanApp {
  connection: Connection;

  private createORMConnection: () => Connection;
  private createRedisConnection = () => Promise;
  private createPubSubConnection = () => Promise;

  static create() {
    return new FailchanApp({
      createORMConnection,
      createRedisConnection,
      createPubSubConnection,
    });
  }

  constructor({
    createORMConnection,
    createRedisConnection,
    createPubSubConnection,
  }) {
    this.createRedisConnection = createRedisConnection;
    this.createPubSubConnection = createPubSubConnection;
    this.createORMConnection = createORMConnection;
  }

  async connectDB() {
    if (!this.connection) {
      this.connection = await this.createORMConnection();
    }
    await this.createRedisConnection();
    await this.createPubSubConnection();
    return this;
  }
}
