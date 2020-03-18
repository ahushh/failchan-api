import config from 'config';
import jwt from 'jsonwebtoken';

import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post';

// TODO: do not use decorators in domain entity
@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => Post, post => post.author)
  posts: Post[];

  generateToken() {
    // TODO: do not use config in domain entity
    return jwt.sign({ authorId: this.id }, config.get<string>('tokenSecret'));
  }

  /**
   * @throws {JsonWebTokenError}
   * @static
   * @param {string} token
   * @returns
   * @memberof Author
   */
  static verifyToken(token: string) {
    return jwt.verify(token, config.get<string>('tokenSecret'));
  }
}
