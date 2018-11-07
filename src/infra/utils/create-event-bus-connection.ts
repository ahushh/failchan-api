// import Bus from 'busmq';
// import { Container } from 'typedi';

// export const createEventBusConnection = () => {
//   const bus = Bus.create({ redis: [process.env.REDIS_URI] });
//   bus.on('error', (err) => {
//     console.log('eventbus error', err);
//   });
//   bus.on('offline', () => {
//     console.log('the bus is offline - redis is down...');
//   });
//   bus.connect();
//   Container.set('bus-connection', bus);
//   return new Promise((resolve, reject) => {
//     bus.on('online', () => {
//       console.log('Event bus online');
//       resolve();
//     });
//   });
// };
