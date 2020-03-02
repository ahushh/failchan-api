import { inject, named } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { ThreadService } from '../../../app/service/thread.service';
import { IAction } from '../../../app/interfaces/action';
import { AppConfigService } from '../../../app/service/app-config.service';

@provide(IOC_TYPE.ListThreadsByBoardAction, true)
@provide('action', true)
export class ListThreadsByBoardAction implements IAction {
  payloadExample = `"boardSlug": "b", "previewPosts"?: 5, "take"?: 10, "skip"?: 15`
  description = ''
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

    const request = {
      boardSlug: this.boardSlug,
      previewPosts: this.previewPosts,
      take: this.take,
      skip: this.skip,
    };
    return this.service.listThreadsByBoard(request);
  }
}
