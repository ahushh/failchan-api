import { AsyncContainerModule, interfaces } from 'inversify';
import { getCustomRepository, Repository } from 'typeorm';

import { IOC_TYPE } from './type';

import { Attachment } from '../domain/entity/attachment';
import { Board } from '../domain/entity/board';
import { Post } from '../domain/entity/post';
import { Thread } from '../domain/entity/thread';

import { IFileRepository } from '../app/interfaces/file.repo';
import { IPubSubConnection } from '../app/interfaces/IPubSubConnection';
import { AttachmentRepository } from '../infra/repository/attachment.repo';
import { BoardRepository } from '../infra/repository/board.repo';
import { AwsS3FileRepository } from '../infra/repository/file/aws.repo';
import { TestFileRepository } from '../infra/repository/file/test.repo';
import { PostRepository } from '../infra/repository/post.repo';
import { ThreadRepository } from '../infra/repository/thread.repo';
import { createORMConnection, IORMConnection } from '../infra/utils/create-orm-connection';
import { createPubSubConnection } from '../infra/utils/create-pubsub-connection';
import { createRedisConnection, IRedisConnection } from '../infra/utils/create-redis-connection';

import { AppConfigService } from '../app/service/app-config.service';
import { Author } from '../domain/entity/author';
import { AuthorRepository } from '../infra/repository/author.repo';

export const bindings = new AsyncContainerModule(
  async (bind: interfaces.Bind, unbind: interfaces.Unbind) => {

    await require('../presentation/http/controller/attachment.controller');
    await require('../presentation/http/controller/board.controller');
    await require('../presentation/http/controller/post.controller');
    await require('../presentation/http/controller/thread.controller');

    bind<any>(IOC_TYPE.AppConfigService).toDynamicValue(() => {
      return new AppConfigService({
        ENV: (process.env.NODE_ENV as any),
        AWS_S3_KEY: (process.env.AWS_S3_KEY as string),
        AWS_S3_SECRET: (process.env.AWS_S3_SECRET as string),
        AWS_S3_BUCKET: (process.env.AWS_S3_BUCKET as string),
        AWS_S3_REGION: (process.env.AWS_S3_REGION as string),
        THUMBNAIL_SIZE: +(process.env.THUMBNAIL_SIZE as string),
        ATTACHMENT_TTL: +(process.env.ATTACHMENT_TTL as string),
      });
    }).inSingletonScope();

    bind<Repository<Attachment>>(IOC_TYPE.AttachmentRepository).toDynamicValue(() => {
      return getCustomRepository(AttachmentRepository);
    }).inRequestScope();

    bind<Repository<Board>>(IOC_TYPE.BoardRepository).toDynamicValue(() => {
      return getCustomRepository(BoardRepository);
    }).inRequestScope();

    bind<Repository<Thread>>(IOC_TYPE.ThreadRepository).toDynamicValue(() => {
      return getCustomRepository(ThreadRepository);
    }).inRequestScope();

    bind<Repository<Post>>(IOC_TYPE.PostRepository).toDynamicValue(() => {
      return getCustomRepository(PostRepository);
    }).inRequestScope();

    bind<Repository<Author>>(IOC_TYPE.AuthorRepository).toDynamicValue(() => {
      return getCustomRepository(AuthorRepository);
    }).inRequestScope();

    bind<IFileRepository>(IOC_TYPE.FileRepository).toDynamicValue((context: interfaces.Context) => {
      const configService = context.container.get<AppConfigService>(IOC_TYPE.AppConfigService);
      const config = configService.getConfig();
      if (config.ENV === 'test') {
        return new TestFileRepository();
      }
      return new AwsS3FileRepository(
        {
          accessKeyId: config.AWS_S3_KEY,
          secretAccessKey: config.AWS_S3_SECRET,
          region: config.AWS_S3_REGION,
        },
        config.AWS_S3_BUCKET,
      );
    }).inRequestScope();

    const pubsubConnection = await createPubSubConnection();
    bind<IPubSubConnection>(IOC_TYPE.PubSubConnection).toConstantValue(pubsubConnection);

    const redisConnection = await createRedisConnection();
    bind<IRedisConnection>(IOC_TYPE.RedisConnection).toConstantValue(redisConnection);

    const ormConnection = await createORMConnection();
    bind<IORMConnection>(IOC_TYPE.ORMConnection).toConstantValue(ormConnection);
  });
