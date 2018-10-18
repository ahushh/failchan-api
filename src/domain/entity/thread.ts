import {
  Entity, PrimaryGeneratedColumn,
  ManyToOne, OneToMany, CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Board } from './board';
import { Post } from './post';

@Entity()
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(type => Board, board => board.threads)
  board: Board;
  @OneToMany(type => Post, post => post.thread)
  posts: Post[];

  @Entity()
  bumpCount = 0;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
