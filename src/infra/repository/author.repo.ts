import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { IAuthorRepository } from '../../app/interfaces/author.repo';
import { Author } from '../../domain/entity/author';

@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> implements IAuthorRepository {
  constructor() {
    super();
  }

}
