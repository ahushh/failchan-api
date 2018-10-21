import {
  EventSubscriber, EntitySubscriberInterface,
  InsertEvent, Repository, UpdateEvent,
} from 'typeorm';
import { Post } from '../../domain/entity/post';
import { PostService } from '../service/post.service';
// tslint:disable-next-line:import-name
import Container, { Inject } from 'typedi';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {

  listenTo() {
    return Post;
  }

  async beforeInsert(event: InsertEvent<Post>) {

  }
  async beforeUpdate(event: UpdateEvent<Post>) {
  }
}
