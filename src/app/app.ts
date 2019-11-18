import { Connection } from 'typeorm';

export class FailchanApp {
  connection: Connection;

  private createORMConnection: () => Connection;
  private createRedisConnection = () => Promise;
  private createPubSubConnection = () => Promise;

  static create({
    createORMConnection,
    createRedisConnection,
    createPubSubConnection,
  }) {
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
