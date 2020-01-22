
import { Repository } from 'typeorm';
import { Author } from '../../domain/entity/author';

export interface IAuthorRepository extends Repository<Author> {

}
