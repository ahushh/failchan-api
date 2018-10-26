export const TEST_THREADS_LISTING_TAKE = 2;
export const TEST_THREADS_LISTING_PREVIEW_POSTS = 2;

export class ListThreadsByBoardCommand {
  boardSlug: string;
  previewPosts = process.env.NODE_ENV === 'test' ? TEST_THREADS_LISTING_PREVIEW_POSTS : 5;
  take = process.env.NODE_ENV === 'test' ? TEST_THREADS_LISTING_TAKE : 10;
  skip = 0;
  constructor({ boardSlug, previewPosts, take, skip }: any) {
    this.boardSlug = boardSlug;
    this.previewPosts = previewPosts || this.previewPosts;
    this.take = take || this.take;
    this.skip = skip || this.skip;
    if (!boardSlug) {
      throw new Error('Board slug must be specified');
    }
  }
}

interface IPost {
  body: string;
  attachmentIds: number[];
  referencies: number[];
  threadId: number;
}

export class CreateThreadCommand {
  post: IPost;
  boardSlug: string;
  constructor(boardSlug: string, post: IPost) {
    this.boardSlug = boardSlug;
    this.post = post;
  }
}
