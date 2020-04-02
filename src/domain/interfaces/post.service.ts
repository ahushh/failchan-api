import { INullable } from '../../infra/utils/types';
import { IPostDTO, Post } from '../entity/post';
import { Thread } from '../entity/thread';

export interface IPostService {
  replyToThread(request: { token?: string; } & IPostDTO): Promise<{ post: Post; token?: string }>;

  updatePost(request: { postId: number; } & INullable<IPostDTO>): Promise<void>;
}
