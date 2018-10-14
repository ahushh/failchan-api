import {
  Entity, PrimaryGeneratedColumn,
  Column, CreateDateColumn, UpdateDateColumn, ManyToMany,
} from 'typeorm';
import { Post } from './post';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mime: string;

  @Column()
  name: string;

  @Column()
  uri: string;

  @Column({ unique: true })
  md5: string;

  @Column()
  size: string;

  @Column('json')
  exif: Object;

  @ManyToMany(type => Post, post => post.attachments)
  post: Post;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
