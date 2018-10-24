
import { ApplicationServer } from './server';

ApplicationServer.getApp().then((app) => {
  ApplicationServer.start(app);
});
