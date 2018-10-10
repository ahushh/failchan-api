import { Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { InjectManager } from 'typeorm-typedi-extensions';
import capitalize from 'lodash/capitalize';

interface EntityNameAndID {
  entityName: string;
  id: string;
}
interface ReposByEntityName {
  [entityName: string]: Repository<any>;
}
@Service()
export class AutobindRoutesService {
  private binded: { [pluralName: string]: any } = {};
  private manager: EntityManager;

  constructor(@InjectManager() private entityManager: EntityManager) {
    this.manager = entityManager;
  }

  bindRouteToEntity(pluralName: string, entity: any) {
    this.binded[pluralName] = entity;
  }

  async getModels(path: string, originalUrl: string): Promise<{ [entityName: string]: any }> {
    const entities: EntityNameAndID[] = this.getEntityNamesAndIds(
      path,
      originalUrl,
    );
    const repos: { [entityName: string]: Repository<any> } = this.getRepos(
      path,
    );
    const requests = entities.map(({ entityName, id }) =>
      repos[entityName]
        .findOne({ where: { id } })
        .then(model => ({ model, entityName })),
    );
    return await Promise.all(requests).then(responses =>
      responses.reduce((a, { model, entityName }) => ({ ...a, [entityName]: model }), {}),
    );
  }
  private getEntityNamesAndIds(
    path: string,
    originalUrl: string,
  ): EntityNameAndID[] {
    const pathSeparated = path.split('/');
    const url = originalUrl.split('/');
    return pathSeparated
      .map((field: string, i: number) => {
        const match = field.match(/\:(\w+)Id/);
        if (match) {
          const entity = match[1];
          return { entityName: capitalize(entity), id: url[i] };
        }
        return null;
      })
      .filter(Boolean) as EntityNameAndID[];
  }
  private getRepos(path: string): ReposByEntityName {
    const repos = {};
    path
      .split('/')
      .filter(Boolean)
      .filter((pluralName: string) => this.binded[pluralName])
      .forEach((pluralName: string) => {
        const entity = this.binded[pluralName];
        const repo = this.manager.getRepository(entity);
        repos[entity.name] = repo;
      });
    return repos;
  }
}
