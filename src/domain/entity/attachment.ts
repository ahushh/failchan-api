import {
  Column, CreateDateColumn,
  Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
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

  constructor(obj?) {
    if (!obj) {
      return;
    }
    this.exif = obj.exif;
    this.md5 = obj.md5;
    this.mime = obj.mimetype;
    this.name = obj.originalname;
    this.thumbnailUri = obj.thumbnailUri;
    this.uri = obj.uri;
    this.size = `${obj.size}`;
  }
  static create(
    exif: Object,
    md5: string,
    mimetype: string,
    originalname: string,
    thumbnailUri: string,
    uri: string,
    size: string | number,
  ) {
    return new Attachment({
      exif, md5, mimetype, originalname, thumbnailUri, uri, size,
    });
  }

  get storageKey() {
    return `${this.md5}/${this.name}`;
  }
  get thumbStorageKey() {
    return this.md5;
  }
}
