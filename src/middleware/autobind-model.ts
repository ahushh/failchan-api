import { Request, Response } from "express";
import { getManager } from "typeorm";
import { ExtendedRequest } from "../interfaces/extended-request";
import { bindedEntities } from "../constants/binded-entities";
import capitalize from "lodash/capitalize";

export async function autoBindModelMiddleware(
  request: ExtendedRequest,
  response: Response,
  next: Function
) {
  const path = request.route.path.split("/");
  const url = request.originalUrl.split("/");
  const entitiesWithId = path
    .map((field: string, i: number) => {
      const match = field.match(/\:(\w+)Id/);
      if (match) {
        const entity = match[1];
        return { entity: capitalize(entity), id: url[i] };
      }
      return null;
    })
    .filter(Boolean);
  const addModelToRequest = entity => model => {
    return request.context.models = !request.context.models
      ? { [entity]: model }
      : { ...request.context.models, [entity]: model };
  };
  const requests = entitiesWithId.map(({ entity, id }) =>
    request.context.repos[entity]
      .findOne({ id })
      .then(addModelToRequest(entity))
  );
  Promise.all(requests).then(() => next())
}
