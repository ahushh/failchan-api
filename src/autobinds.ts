import { AutobindRoutesService } from "./services/autobind-routes";
import { Post } from "./entity/post";

export function autobindRoutes(Container) {
  const service = Container.get(AutobindRoutesService);
  service.bindRouteToEntity('posts', Post)
}