import { Service } from 'typedi';
import { EntityManager, Repository, EntitySchema } from 'typeorm';
import { InjectManager } from 'typeorm-typedi-extensions';
import capitalize from 'lodash/capitalize';

interface EntityNameAndID {
  entityName: string;
  id: string;
  idField: string;
}

interface ReposByEntityName {
  [entityName: string]: Repository<any>;
}

export interface BindedModels {
  [pluralName: string]: { entity: any, name: string, idField: string };
}

@Service()
export class AutobindRoutesService {
  private manager: EntityManager;

  constructor(@InjectManager() private entityManager: EntityManager) {
    this.manager = entityManager;
  }

  async getModels(
    path: string,
    originalUrl: string,
    binded: BindedModels,
  ): Promise<{ [entityName: string]: any }> {
    const entities: EntityNameAndID[] = this.getEntityNamesAndIds(
      path,
      originalUrl,
      binded,
    );
    const repos: { [entityName: string]: Repository<any> } = this.getRepos(
      path,
      binded,
    );
    const requests = entities.map(({ entityName, id, idField }) =>
      repos[entityName]
        .findOne({ where: { [idField]: id } })
        .then(model => ({ model, entityName })),
    );
    return await Promise.all(requests).then(responses =>
      responses.reduce((a, { model, entityName }) => ({ ...a, [entityName]: model }), {}),
    );
  }
  private getEntityNamesAndIds(
    path: string,
    originalUrl: string,
    binded: BindedModels,
  ): EntityNameAndID[] {
    const pathSeparated = path.split('/');
    const url = originalUrl.split('/');
    return pathSeparated
      .map((field: string, i: number) => {
        // tslint:disable-next-line:one-variable-per-declaration
        let name, idField;
        const match = Object.values(binded).filter((x) => {
          const match = field.match(
            new RegExp(`\\:${x.name.toLowerCase()}${capitalize(x.idField)}`),
          );
          if (match) {
            name = capitalize(x.name);
            idField = x.idField;
            return true;
          }
          return false;
        });
        // const match = field.match(new RegExp(`\\:${name}${idField}`));
        if (match.length !== 0) {
          return { idField, entityName: capitalize(name), id: url[i] };
        }
        return null;
      })
      .filter(Boolean) as EntityNameAndID[];
  }
  private getRepos(path: string, binded: BindedModels): ReposByEntityName {
    const repos = {};
    path
      .split('/')
      .filter(Boolean)
      .filter((pluralName: string) => binded[pluralName])
      .forEach((pluralName: string) => {
        const { entity } = binded[pluralName];
        const repo = this.manager.getRepository(entity);
        repos[entity.name] = repo;
      });
    return repos;
  }
}
