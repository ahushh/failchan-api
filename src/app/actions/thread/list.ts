import Container from 'typedi';
import { IAction } from '../../interfaces/action';
import { ThreadService } from '../../service/thread.service';

export class ListThreadsByBoardAction implements IAction {
  static TEST_THREADS_LISTING_TAKE = 2;
  static TEST_THREADS_LISTING_PREVIEW_POSTS = 2;

  boardSlug: string;
  previewPosts = process.env.NODE_ENV === 'test'
    ? ListThreadsByBoardAction.TEST_THREADS_LISTING_PREVIEW_POSTS
    : 5;
  take = process.env.NODE_ENV === 'test'
    ? ListThreadsByBoardAction.TEST_THREADS_LISTING_TAKE
    : 10;
  skip = 0;

  constructor(request: { boardSlug: string, previewPosts?: number, take?: number, skip?: number });
  constructor({ boardSlug, previewPosts, take, skip }) {
    this.boardSlug = boardSlug;
    this.previewPosts = previewPosts || this.previewPosts;
    this.take = take || this.take;
    this.skip = skip || this.skip;
    if (!boardSlug) {
      throw new Error('Board slug must be specified');
    }
  }
  execute() {
    const service = Container.get(ThreadService);
    const request = {
      boardSlug: this.boardSlug,
      previewPosts: this.previewPosts,
      take: this.take,
      skip: this.skip,
    };
    return service.listThreadsByBoardHandler(request);
  }
}
