export interface IPubSubConnection {
  pub: {
    publish: any;
  };
  sub: {
    on: any;
    subscribe: any;
  };
}
