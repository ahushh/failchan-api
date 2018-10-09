import { Request, Response } from "express";
import { getManager } from "typeorm";
import { ExtendedRequest } from "../interfaces/extended-request";
import { bindedEntities } from "../constants/binded-entities";

export function repoMiddleware(
  request: ExtendedRequest,
  response: Response,
  next: Function
) {
  request.route.path
    .split("/")
    .filter(Boolean)
    .filter((pluralName: string) => bindedEntities[pluralName])
    .forEach(pluralName => {
      const { entity, name } = bindedEntities[pluralName];
      const repo = getManager().getRepository(entity as any);
      
      if (!request.context) {
        request.context = {};
      }
      if (!request.context.repos) {
        request.context.repos = {};
      }
      request.context.repos[name] = repo;

    });
  next();
}
