export const IOC_TYPE = {
  // infra
  PubSubConnection: Symbol.for('PubSubConnection'),
  RedisConnection: Symbol.for('RedisConnection'),
  ORMConnection: Symbol.for('ORMConnection'),

  FileFactory: Symbol.for('FileFactory'),

  FileRepository: Symbol.for('FileRepository'),
  AttachmentRepository: Symbol.for('AttachmentRepository'),
  BoardRepository: Symbol.for('BoardRepository'),
  ThreadRepository: Symbol.for('ThreadRepository'),
  PostRepository: Symbol.for('PostRepository'),

  CreateAttachmentAction: Symbol.for('CreateAttachmentAction'),
  DeleteAttachmentAction: Symbol.for('DeleteAttachmentAction'),
  CreateBoardAction: Symbol.for('CreateBoardAction'),
  ListBoardAction: Symbol.for('ListBoardAction'),
  CreatePostAction: Symbol.for('CreatePostAction'),
  UpdatePostAction: Symbol.for('UpdatePostAction'),
  CreateThreadAction: Symbol.for('CreateThreadAction'),
  ListThreadsByBoardAction: Symbol.for('ListThreadsByBoardAction'),

  // app
  AttachmentService: Symbol.for('AttachmentService'),
  BoardService: Symbol.for('BoardService'),
  PostService: Symbol.for('yoba peka PostService'),
  PubSubService: Symbol.for('PubSubService'),
  ThreadService: Symbol.for('ThreadService'),

  ExpiredAttachmentService: Symbol.for('ExpiredAttachmentService'),
  // domain
  DomainPostService: Symbol.for('DomainPostService'),
};
