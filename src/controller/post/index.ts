import { postsListAction } from "./list";
import { postsCreateAction } from "./create";
import { postsGetAction } from "./get";

export const postController = {
  index: postsListAction,
  create: postsCreateAction,
  get: postsGetAction,
}