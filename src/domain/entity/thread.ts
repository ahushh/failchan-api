import {
  Entity, PrimaryGeneratedColumn,
  ManyToOne, OneToMany, CreateDateColumn,
  UpdateDateColumn,
  Column,
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

  bump() {
    this.bumpCount = (this.bumpCount || 0) + 1;
  }
}
