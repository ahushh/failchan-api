import { Redis } from 'ioredis';
import { Inject, Service } from 'typedi';

@Service()
export class PubSubService {
  constructor(
    @Inject('pubsub-connection') private pubsub: { pub: Redis, sub: Redis },
  ) {
  }
  publish(channel, message) {
    this.pubsub.pub.publish(channel, message);
  }
  subscribe(channel) {
    this.pubsub.sub.subscribe(channel);
  }
  on(event, callback) {
    this.pubsub.sub.on(event, (channel, message) => {
      callback(channel, message);
    });
  }
}
