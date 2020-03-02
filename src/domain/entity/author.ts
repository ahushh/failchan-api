import jwt from 'jsonwebtoken';

import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => Post, post => post.author)
  posts: Post[];

  generateToken() {
    return jwt.sign({ authorId: this.id }, process.env.TOKEN_SECRET);
  }

  /**
   * @throws {JsonWebTokenError}
   * @static
   * @param {string} token
   * @returns
   * @memberof Author
   */
  static verifyToken(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  }
}
