import { Container } from 'inversify';
import { IOC_TYPE } from '../../config/type';
import { IPostService } from '../../domain/interfaces/post.service';

export const replyToThreadFactory = (container: Container) =>
  async (thread, body, references: number[] = []) => {
    const postService: IPostService = container.get(IOC_TYPE.PostService);
    const post = { body, references, attachmentIds: [] };
    const request = { ...post, threadId: thread.id };
    return postService.replyToThread(request);
  };
