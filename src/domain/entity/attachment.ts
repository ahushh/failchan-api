import {
  Entity, PrimaryGeneratedColumn,
  Column, CreateDateColumn, UpdateDateColumn, ManyToMany, ManyToOne,
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

  @Column()
  md5: string;

  @Column()
  size: string;

  @Column('json')
  exif: Object;

  @Column()
  thumbnailUri: string;

  @ManyToOne(type => Post, post => post.attachments)
  post: Post;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
