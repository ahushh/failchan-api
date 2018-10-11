import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
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

}
