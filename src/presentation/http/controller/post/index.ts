// import { postsListAction } from './list';
import { postsCreateAction } from './create';
import { postsUpdateAction } from './update';
// import { postsGetAction } from './get';

export const postController = {
  create: postsCreateAction,
  update: postsUpdateAction,
  // get: postsGetAction,
  // list: postsListAction,
};
