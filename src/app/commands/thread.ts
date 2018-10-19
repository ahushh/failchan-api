
export class ListThreadsByBoardCommand {
  boardSlug: string;
  previewPosts = 5;
  take = 10;
  skip = 0;
  constructor({ boardSlug, previewPosts, take, skip }: any) {
    this.boardSlug    = boardSlug;
    this.previewPosts = previewPosts || this.previewPosts;
    this.take         = take || this.take;
    this.skip         = skip || this.skip;
    if (!boardSlug) {
      throw new Error('Board slug must be specified');
    }
  }
}
