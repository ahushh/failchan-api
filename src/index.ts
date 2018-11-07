
import { ApplicationServer } from './presentation/http/server';

ApplicationServer
  .connectBus()
  .then((server) => {
    return server.connectDB();
  })
  .then((server) => {
    server.listen();
  });
