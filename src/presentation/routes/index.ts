import express, { Router } from 'express';

import { postController } from '../controller/post';
import { boardController } from '../controller/board';
import { threadController } from '../controller/thread';
import { fileUploadMiddleware } from '../middleware/file-upload';
import { attachmentController } from '../controller/attachment';

const router: Router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  res.json({ title: 'Express' });
});

router.post('/boards', boardController.create);
router.get('/boards', boardController.list);

router.get('/boards/:boardSlug/threads', threadController.listByBoard);
router.post('/boards/:boardSlug/threads', threadController.create);

router.post('/threads/:threadId/posts', postController.create);
router.post('/attachments', fileUploadMiddleware, attachmentController.create);
// router.post(
//   '/boards/:boardSlug/threads',
//   [bindBoard],
//   threadController.create,
// );
// router.get(
//   '/boards/:boardSlug/threads',
//   [bindBoard],
//   threadController.list,
// );

// /* threads */
// const bindThread = autoBindModelMiddleware({
//   threads: { entity: Thread, name: 'thread', idField: 'id' },
// });
// router.get(
//   '/threads/:threadId/posts',
//   [bindThread],
//   threadController.get,
// );

// router.post(
//   '/threads/:threadId/posts',
//   [bindThread],
//   postController.create,
// );
// router.get('/posts', [autoBindModelMiddleware()], postController.index);
// router.post('/posts', [autoBindModelMiddleware()], postController.create);
// router.get('/posts/:postId', [autoBindModelMiddleware()], postController.get);

export default router;
