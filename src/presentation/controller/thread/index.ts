import { threadsCreateAction } from './create';
// import { threadsListAction } from './list';
// import { threadsGetAction } from './get';
import { threadsListByBoardAction } from './list-by-board';

export const threadController = {
  create: threadsCreateAction,
  // list: threadsListAction,
  // get: threadsGetAction,
  listByBoard: threadsListByBoardAction,
};
