import { Redis } from 'ioredis';
import { Inject, Service } from 'typedi';
import { IAttachmentFile } from '../../domain/interfaces/attachment-file';
import { deleteFileSubdir } from '../../infra/utils/delete-temp-file';
import { PubSubService } from '../service/pub-sub.service';

@Service()
export class ExpiredAttachmentService {
  constructor(
    @Inject(type => PubSubService) public pubsub: PubSubService,
    @Inject('redis-connection') public redis: Redis,
  ) { }
  listen() {
    this.pubsub.subscribe('__keyevent@0__:expired');
    this.pubsub.on('message', async (channel, key) => {
      const [entity, type, uid] = key.split(':');
      if (!(entity === 'attachment' && type === 'cache')) {
        return;
      }
      const dataKey = `attachment:data:${uid}`;
      const dataString = await this.redis.get(dataKey);
      if (!dataString) {
        return;
      }
      this.redis.del(dataKey);
      let data: IAttachmentFile[];
      try {
        data = JSON.parse(dataString);
      } catch (e) {
        console.warn(`channel: ${channel}, key: ${key}, dataString: ${dataString}`);
        return;
      }
      try {
        await Promise.all(
          data.map(f => deleteFileSubdir(f.path)),
        );
      } catch (e) {
        console.warn(e);
      }
    });
  }
}
