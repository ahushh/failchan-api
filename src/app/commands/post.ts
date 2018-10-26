
export class ReplyToThreadCommand {
  threadId: number;
  body: string;
  attachmentIds: number[] = [];
  referencies: number[] = [];

  constructor({ body, attachmentIds, referencies, threadId }) {
    this.threadId = threadId;
    this.body = body;
    if (!(this.threadId && this.body)) {
      throw new Error('threadId and body must be specified');
    }
    this.attachmentIds = attachmentIds || this.attachmentIds;
    this.referencies = referencies || this.referencies;
  }
}

export class UpdatePostCommand {
  postId: number;
  threadId: number | null = null;
  body: string | null = null;
  attachmentIds: number[] | null = null;
  referencies: number[] | null = null;
  constructor({ postId, threadId, body, attachmentIds, referencies }) {
    this.postId = +postId;
    if (!this.postId || isNaN(this.postId)) {
      throw new Error('postId must be specified');
    }
    this.threadId = +threadId;
    this.body = body;
    this.attachmentIds = attachmentIds;
    this.referencies = referencies;
  }
}
