import { Request, Response } from 'express';
import { Container } from 'typedi';
import { AutobindRoutesService } from '../services/autobind-routes';

export const autoBindModelMiddleware = () => {
  return async function autoBindModelMiddleware(
    request: Request,
    response: Response,
    next: Function,
  ) {
    const service = Container.get(AutobindRoutesService);
    const models = await service.getModels(
      request.route.path,
      request.originalUrl,
    );
    request.context = request.context || {};
    request.context.models = models;
    next();
  };

};
