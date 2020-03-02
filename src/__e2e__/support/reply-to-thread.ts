import { Container } from 'inversify';

import { IOC_TYPE } from '../../config/type';
import { Thread } from '../../domain/entity/thread';
import { IPostService } from '../../domain/interfaces/post.service';

export const replyToThreadFactory = (container: Container) =>
  async (thread: Thread, body: string, references: number[] = [], token?: string) => {
    const postService: IPostService = container.get(IOC_TYPE.PostService);
    const post = { body, references, attachmentIds: [] };
    const request = { ...post, token, threadId: thread.id };
    return postService.replyToThread(request);
  };
