import { IAction } from '../../interfaces/action';
import { ThreadService } from '../../service/thread.service';
import { IOC_TYPE } from '../../../config/type';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

@provide(IOC_TYPE.ListThreadsByBoardAction)
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

  constructor(
    @inject(IOC_TYPE.ThreadService) public service: ThreadService,
  ) {}

  execute(request: { boardSlug: string, previewPosts?: number, take?: number, skip?: number });

  execute({ boardSlug, previewPosts, take, skip }) {
    this.boardSlug = boardSlug;
    this.previewPosts = previewPosts || this.previewPosts;
    this.take = take || this.take;
    this.skip = skip || this.skip;
    if (!boardSlug) {
      throw new Error('Board slug must be specified');
    }

    const request = {
      boardSlug: this.boardSlug,
      previewPosts: this.previewPosts,
      take: this.take,
      skip: this.skip,
    };
    return this.service.listThreadsByBoard(request);
  }
}
