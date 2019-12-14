// TODO: rename file, complete interface with types, add pubsub repo maybe
export interface IPubSubConnection {
  pub: {
    publish: any;
  };
  sub: {
    on: any;
    subscribe: any;
  };
}
