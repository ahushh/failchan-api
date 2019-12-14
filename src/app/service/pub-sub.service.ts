
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../config/type';
import { IPubSubConnection } from '../interfaces/IPubSubConnection';

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
