import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
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
}
