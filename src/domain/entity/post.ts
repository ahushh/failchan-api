import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { Thread } from './thread';

export interface IPost {
  body: string;
}

@Entity()
export class Post implements IPost {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  body: string;
  @ManyToOne(type => Thread, thread => thread.posts)
  thread: Thread;
}
