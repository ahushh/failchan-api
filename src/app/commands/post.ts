export interface ICreatePostCommand {
  body: string;
  attachmentIds?: number[];
  referencies?: number[];
}
