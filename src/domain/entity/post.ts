import { plainToClass } from 'class-transformer';

import {
  Column, CreateDateColumn, Entity,
  JoinTable, ManyToMany, ManyToOne,
  OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Attachment } from './attachment';
import { Thread } from './thread';

export interface INewPost {
  body: string;
  references: Post[];
  attachments: Attachment[];
}

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

  /**
  * @description List of replies to this post
  * @type {Post[]}
  * @memberof Post
  */
  @ManyToMany(type => Post)
  @JoinTable()
  replies: Post[];

  /**
  * @description List of posts which this post replies to
  * @type {Post[]}
  * @memberof Post
  */
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

  static create(props: INewPost) {
    const { body, references, attachments } = props;

    const post = new Post({ body });
    post.references = references;
    post.attachments = attachments;
    return post;
  }

  /***
   * Adds a reply to list
   * If reply already exists, does nothing
   */
  private addReply(post: Post) {
    const alreadyAdded = this.replies.find(p => p.id === post.id);
    if (!alreadyAdded) {
      this.replies.push(post);
    }
  }
  private removeReply(postId: number) {
    this.replies = this.replies.filter(reply => reply.id !== postId);
  }

  /***
   * Updates references by adding the Post to their replies
   */
  addPostToRefsReplies() {
    this.references.forEach((ref: Post) => ref.addReply(this));
  }
  /***
   * Removes references by given ids and returns removed entities
   */
  private removeReferencesByIds(ids: number[]): Post[] {
    const removedRefs = this.references.filter(p => ids.includes(p.id));
    removedRefs.forEach(ref => ref.removeReply(this.id));
    this.references = this.references.filter(p => !ids.includes(p.id));
    return removedRefs;
  }

  /**
   * @description Updates post's references and returns entities which needs to be saved in repo
   * @date 2019-12-16
   * @param {Post[]} newReferences
   * @returns {{ newReferences: Post[], removedReferences: Post[] }}
   * @memberof Post
   */
  updateReferences(newReferences: Post[]): { newReferences: Post[], removedReferences: Post[] } {
    const newRefsIds = newReferences.map(r => r.id);
    const idsToRemove = this.references
      .filter(p => !newRefsIds.includes(p.id))
      .map(p => p.id);
    const removedReferences = this.removeReferencesByIds(idsToRemove);
    this.references = newReferences;
    this.addPostToRefsReplies();
    return { newReferences, removedReferences };
  }
}
