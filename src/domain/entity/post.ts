import { plainToClass } from 'class-transformer';

import {
  Column, CreateDateColumn, Entity,
  JoinTable, ManyToMany, ManyToOne,
  OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Attachment } from './attachment';
import { Thread } from './thread';

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  body: string;
  @ManyToOne(type => Thread, thread => thread.posts)
  thread: Thread;

  @OneToMany(type => Attachment, attachment => attachment.post)
  attachments: Attachment[];

  @ManyToMany(type => Post)
  @JoinTable()
  replies: Post[];

  @ManyToMany(type => Post)
  @JoinTable()
  referencies: Post[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(obj?) {
    if (!obj) {
      return;
    }
    this.body = obj.body;
  }

  static create(body: string, referencies: Post[], attachments: Attachment[]) {
    const post = new Post({ body });
    post.referencies = referencies;
    post.attachments = attachments;
    return post;
  }

  addReply(post: Post) {
    const alreadyAdded = this.replies.find(p => p.id === post.id);
    if (!alreadyAdded) {
      this.replies.push(post);
    }
  }

  // synchronize post referencies and replies of the referencies
  updateRefsReplies(): Post[] {
    this.referencies.forEach((ref: Post) => ref.addReply(this));
    return this.referencies;
  }
}
