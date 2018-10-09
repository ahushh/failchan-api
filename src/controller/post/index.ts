import { postsListAction } from "./list";
import { postsCreateAction } from "./create";

export const postController = {
  index: postsListAction,
  create: postsCreateAction,
}