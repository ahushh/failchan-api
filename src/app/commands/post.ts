export interface ICreatePostCommand {
  body: string;
  attachmentIds?: number[];
  referencies?: number[];
}

export interface IUpdatePostCommand extends ICreatePostCommand {
  threadId?: number;
}
