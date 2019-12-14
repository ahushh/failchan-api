import { Repository } from 'typeorm';
import { Post } from '../../domain/entity/post';

export interface IPostRepository extends Repository<Post> {
}
