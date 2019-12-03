import { Attachment } from '../entity/attachment';
import { Post } from '../entity/post';
import { Thread } from '../entity/thread';

export interface IReply {
  body: string;
  attachments: Attachment[];
  references: Post[];
  thread: Thread;
}
