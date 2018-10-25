// tslint:disable
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1540310615295 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('CREATE TABLE "board" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae7bfe48cb8fca88f4f99f13125" UNIQUE ("slug"), CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "thread" ("id" SERIAL NOT NULL, "bumpCount" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" integer, CONSTRAINT "PK_cabc0f3f27d7b1c70cf64623e02" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "attachment" ("id" SERIAL NOT NULL, "mime" character varying NOT NULL, "name" character varying NOT NULL, "uri" character varying NOT NULL, "md5" character varying NOT NULL, "size" character varying NOT NULL, "exif" json NOT NULL, "thumbnailUri" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "post" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "threadId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "post_replies_post" ("postId_1" integer NOT NULL, "postId_2" integer NOT NULL, CONSTRAINT "PK_817f09e9f9ec9fc66fb373ffe64" PRIMARY KEY ("postId_1", "postId_2"))');
    await queryRunner.query('CREATE TABLE "post_referencies_post" ("postId_1" integer NOT NULL, "postId_2" integer NOT NULL, CONSTRAINT "PK_f17cb8a4625c6018b677677e4d7" PRIMARY KEY ("postId_1", "postId_2"))');
    await queryRunner.query('ALTER TABLE "thread" ADD CONSTRAINT "FK_d9bf15a4e7f789047ac057c3a5a" FOREIGN KEY ("boardId") REFERENCES "board"("id")');
    await queryRunner.query('ALTER TABLE "attachment" ADD CONSTRAINT "FK_09f5bc45017ed4f20ad606985a0" FOREIGN KEY ("postId") REFERENCES "post"("id")');
    await queryRunner.query('ALTER TABLE "post" ADD CONSTRAINT "FK_b148d2f5a22e7904160c69b09f8" FOREIGN KEY ("threadId") REFERENCES "thread"("id")');
    await queryRunner.query('ALTER TABLE "post_replies_post" ADD CONSTRAINT "FK_76a93176987075f0d2d01cf4e1b" FOREIGN KEY ("postId_1") REFERENCES "post"("id") ON DELETE CASCADE');
    await queryRunner.query('ALTER TABLE "post_replies_post" ADD CONSTRAINT "FK_aa539e87a4586c9e8c8a2bc80fa" FOREIGN KEY ("postId_2") REFERENCES "post"("id") ON DELETE CASCADE');
    await queryRunner.query('ALTER TABLE "post_referencies_post" ADD CONSTRAINT "FK_f2b15912fe66a5b4df971ce2471" FOREIGN KEY ("postId_1") REFERENCES "post"("id") ON DELETE CASCADE');
    await queryRunner.query('ALTER TABLE "post_referencies_post" ADD CONSTRAINT "FK_14b0a5cf0c4cf5b645206da9400" FOREIGN KEY ("postId_2") REFERENCES "post"("id") ON DELETE CASCADE');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "post_referencies_post" DROP CONSTRAINT "FK_14b0a5cf0c4cf5b645206da9400"');
    await queryRunner.query('ALTER TABLE "post_referencies_post" DROP CONSTRAINT "FK_f2b15912fe66a5b4df971ce2471"');
    await queryRunner.query('ALTER TABLE "post_replies_post" DROP CONSTRAINT "FK_aa539e87a4586c9e8c8a2bc80fa"');
    await queryRunner.query('ALTER TABLE "post_replies_post" DROP CONSTRAINT "FK_76a93176987075f0d2d01cf4e1b"');
    await queryRunner.query('ALTER TABLE "post" DROP CONSTRAINT "FK_b148d2f5a22e7904160c69b09f8"');
    await queryRunner.query('ALTER TABLE "attachment" DROP CONSTRAINT "FK_09f5bc45017ed4f20ad606985a0"');
    await queryRunner.query('ALTER TABLE "thread" DROP CONSTRAINT "FK_d9bf15a4e7f789047ac057c3a5a"');
    await queryRunner.query('DROP TABLE "post_referencies_post"');
    await queryRunner.query('DROP TABLE "post_replies_post"');
    await queryRunner.query('DROP TABLE "post"');
    await queryRunner.query('DROP TABLE "attachment"');
    await queryRunner.query('DROP TABLE "thread"');
    await queryRunner.query('DROP TABLE "board"');
  }

}
