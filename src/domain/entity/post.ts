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
  references: Post[];

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

  static create(body: string, references: Post[], attachments: Attachment[]) {
    const post = new Post({ body });
    post.references = references;
    post.attachments = attachments;
    return post;
  }

  /***
   * Adds a reply to list
   * If reply already exists, does nothing
   */
  addReply(post: Post) {
    const alreadyAdded = this.replies.find(p => p.id === post.id);
    if (!alreadyAdded) {
      this.replies.push(post);
    }
  }
  removeReply(postId: number) {
    this.replies = this.replies.filter(reply => reply.id !== postId);
  }

  /***
   * Updates references by adding the Post to their replies
   */
  addPostToRefsReplies() {
    this.references.forEach((ref: Post) => ref.addReply(this));
  }
  /***
   * Removes references and returns removed
   */
  removeReferencesByIds(ids: number[]): Post[] {
    const removedRefs = this.references.filter(p => ids.includes(p.id));
    removedRefs.forEach(ref => ref.removeReply(this.id));
    this.references = this.references.filter(p => !ids.includes(p.id));
    return removedRefs;
  }
}
