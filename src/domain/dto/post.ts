import { Attachment } from '../entity/attachment';
import { Post } from '../entity/post';
import { Thread } from '../entity/thread';

export interface PostDTO {
  body: string;
  attachments: Attachment[];
  referencies: Post[];
  thread: Thread;
}
