
import { IOC_TYPE } from '../../config/type';
import { provide } from 'inversify-binding-decorators';
import { IPubSubConnection } from '../../infra/utils/create-pubsub-connection';
import { inject } from 'inversify';

@provide(IOC_TYPE.PubSubService)
export class PubSubService {
  constructor(
    @inject(IOC_TYPE.PubSubConnection) private pubsub: IPubSubConnection,
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
