import { Request, Response } from 'express';
import { Container } from 'typedi';
import { AutobindRoutesService, BindedModels } from '../service/autobind-routes';

export const autoBindModelMiddleware = (binded: BindedModels) => {
  return async function autoBindModelMiddleware(
    request: Request,
    response: Response,
    next: Function,
  ) {
    const service = Container.get(AutobindRoutesService);
    const models = await service.getModels(
      request.route.path,
      request.originalUrl,
      binded,
    );
    request.context = request.context || {};
    request.context.models = models;
    next();
  };

};
