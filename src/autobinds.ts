import { AutobindRoutesService } from './services/autobind-routes';
import { Post } from './entity/post';

// tslint:disable-next-line:variable-name
export function autobindRoutes(Container) {
  const service = Container.get(AutobindRoutesService);
  service.bindRouteToEntity('posts', Post);
}
