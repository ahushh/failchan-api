import { boardsCreateAction } from './create';
// import { boardsGetAction } from './get';
import { boardsListAction } from './list';

export const boardController = {
  create: boardsCreateAction,
  // get: boardsGetAction,
  list: boardsListAction,
};
