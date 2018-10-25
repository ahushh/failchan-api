import {
  Column, CreateDateColumn, Entity,
  ManyToMany, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Thread } from './thread';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @OneToMany(type => Thread, thread => thread.board)
  threads: Thread[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(obj?) {
    if (!obj) {
      return;
    }
    this.slug = obj.slug;
    this.name = obj.name;
  }

  static create(slug: string, name: string) {
    return new Board({ slug, name });
  }
}
