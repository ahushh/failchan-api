import { Container, Inject, Service } from 'typedi';

export enum CHANNEL {
  ATTACHMENTS_CREATE = 'attachments:create',
  ATTACHMENTS_CREATED = 'attachments:created',
}

type Listener = (message: any) => void;

@Service()
export class EventBus {
  private channels = new Map<Listener>();

  constructor(
    @Inject('bus-connection') private bus: any,
  ) {
  }

  subscribe(channel: string, listener: Listener) {
    const s = this.bus.pubsub(channel);
    s.on('message', (message) => {
      try {
        listener(JSON.parse(message));
      } catch (e) {
        listener(message);
      }
    });
    this.channels.set(listener, channel);
    s.subscribe();
    return () => this.unsubscribe(listener);
  }
  once(channel: string, listener: Listener) {
    let unsubscribe;
    unsubscribe = this.subscribe(channel, (data) => {
      listener(data);
      unsubscribe();
    });
  }
  private unsubscribe(listener: Listener) {
    if (this.channels.has(listener)) {
      this.channels.get(listener).unsubscribe();
      this.channels.delete(listener);
    }
  }
  publish(channel: string, message: any) {
    this.bus.pubsub(channel).publish(message);
  }
}
