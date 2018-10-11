import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Thread } from '../entity/thread';
import { Repository } from 'typeorm';
import { Board } from '../entity/board';
import { Post, IPost } from '../entity/post';
import { ThreadRepository } from '../repository/thread';
import { IThreadRepository } from '../domain/thread.repo.interface';

@Service()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Thread) private threadRepo: ThreadRepository,
    ) {
    this.postRepo = postRepo;
    this.threadRepo = threadRepo;
  }

  async create(threadId: number, postData: IPost): Promise<Post> {
    const thread = await this.threadRepo.findOneOrFail({ where: { id: threadId } });
    const post = new Post();
    post.thread = thread;
    post.body = postData.body;
    return this.postRepo.save(post);
  }

  getPostsByThreadId(threadId: string): Promise<Post[]> {
    return this.postRepo.find({ where: { threadId } });
  }
  // getThreadWithPosts(boardId: string, threadId: string): Promise<Thread | undefined> {
  //   return this.postRepo.findOne({ where: { boardId, id: threadId }, relations: ['posts'] });
  // }
}
