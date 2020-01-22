import jwt from 'jsonwebtoken';

import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Post } from "./post";


@Entity()
export class Author {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToMany(type => Post, post => post.author)
    posts: Post[];


    generateToken() {
        return jwt.sign({ authorId: this.id }, 'verysecret');
    }

    static verifyToken(token: string) {
        return jwt.verify(token, 'verysecret');
    }
}

