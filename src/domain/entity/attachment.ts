import {
  Column, CreateDateColumn,
  Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Post } from './post';

export interface INewAttachment {
  exif: Object;
  md5: string;
  mime: string;
  originalName: string;
  thumbnailUri: string;
  uri: string;
  size: number;
}
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

  private toHumanReadableSize(len: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    let order = 0;
    while (len >= 1024 && order < sizes.length - 1) {
      // tslint:disable-next-line: no-increment-decrement
      order++;
      // tslint:disable-next-line: no-parameter-reassignment
      len = len / 1024;
    }
    return `${len.toFixed(2)}${sizes[order]}`;
  }

  constructor(obj?: INewAttachment) {
    if (!obj) {
      return;
    }
    this.exif = obj.exif;
    this.md5 = obj.md5;
    this.mime = obj.mime;
    this.name = obj.originalName;
    this.thumbnailUri = obj.thumbnailUri;
    this.uri = obj.uri;
    this.size = this.toHumanReadableSize(obj.size);
  }

  static create(props: INewAttachment) {
    return new Attachment(props);
  }

  get storageKey() {
    return `${this.md5}/${this.name}`;
  }
  get thumbStorageKey() {
    return this.md5;
  }
}
