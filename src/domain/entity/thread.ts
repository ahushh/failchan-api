import {
  Column, CreateDateColumn,
  Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
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

  @Column({ nullable: true })
  bumpCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  static create(board: Board) {
    const thread = new Thread();
    thread.board = board;
    return thread;
  }

  reply(post: Post) {
    this.bump();
  }

  sortPosts() {
    this.posts = this.posts.sort((a, b) => a.id > b.id ? 1 : -1);
  }

  bump() {
    this.bumpCount = (this.bumpCount || 0) + 1;
  }
}
