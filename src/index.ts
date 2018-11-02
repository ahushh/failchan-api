
import { ApplicationServer } from './presentation/http/server';

ApplicationServer.connectDB().then((server) => {
  server.listen();
});
