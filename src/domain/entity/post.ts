import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToMany, ManyToOne, CreateDateColumn,
  UpdateDateColumn, OneToMany, JoinTable,
} from 'typeorm';
import { Thread } from './thread';
import { Attachment } from './attachment';

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
}
