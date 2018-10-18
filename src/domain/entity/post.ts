import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToMany, ManyToOne, CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Thread } from './thread';
import { Attachment } from './attachment';

export interface IPost {
  body: string;
  attachmentIds?: number[];
}

@Entity()
export class Post implements IPost {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  body: string;
  @ManyToOne(type => Thread, thread => thread.posts)
  thread: Thread;

  @OneToMany(type => Attachment, attachment => attachment.post)
  attachments: Attachment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
