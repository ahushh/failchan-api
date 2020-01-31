import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { bindings } from './inversity.config';

export const createContainer = async () => {
  const container = new Container();

  await require('../app/service/attachment.service');
  await require('../app/service/board.service');
  await require('../app/service/post.service');
  await require('../app/service/pub-sub.service');
  await require('../app/service/thread.service');
  await require('../app/service/author.service');
  await require('../app/listeners/expired-attachments');

  await require('../infra/class/file/file.factory');

  await container.loadAsync(bindings);

  container.load(buildProviderModule());
  return container;
};
