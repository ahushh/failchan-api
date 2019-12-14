import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { AppErrorActionRequestValidation } from '../../errors/action';
import { ValidationError } from '../../errors/validation';
import { ThreadService } from '../../service/thread.service';
import { IAction } from '../action';
import { AppConfigService } from '../../service/app-config.service';

@provide(IOC_TYPE.ListThreadsByBoardAction)
export class ListThreadsByBoardAction implements IAction {
  static TEST_THREADS_LISTING_TAKE = 2;
  static TEST_THREADS_LISTING_PREVIEW_POSTS = 2;

  boardSlug: string;
  previewPosts = 5;
  take = 10;
  skip = 0;

  constructor(
    @inject(IOC_TYPE.ThreadService) public service: ThreadService,
    @inject(IOC_TYPE.AppConfigService) public appConfig: AppConfigService,
  ) {
    this.previewPosts = this.appConfig.getConfig().ENV === 'test'
    ? ListThreadsByBoardAction.TEST_THREADS_LISTING_PREVIEW_POSTS
    : 5;
    this.take = this.appConfig.getConfig().ENV === 'test'
    ? ListThreadsByBoardAction.TEST_THREADS_LISTING_TAKE
    : 10;
  }

  execute(request: { boardSlug: string, previewPosts?: number, take?: number, skip?: number });

  execute({ boardSlug, previewPosts, take, skip }) {
    this.boardSlug = boardSlug;
    this.previewPosts = previewPosts || this.previewPosts;
    this.take = take || this.take;
    this.skip = skip || this.skip;
    if (!boardSlug) {
      throw new AppErrorActionRequestValidation('boardSlug', ValidationError.Required, boardSlug);
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
