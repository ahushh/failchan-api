import express, { Router } from 'express';

import { attachmentController } from '../controller/attachment';
import { boardController } from '../controller/board';
import { postController } from '../controller/post';
import { threadController } from '../controller/thread';
import { fileUploadMiddleware } from '../middleware/file-upload';

const router: Router = express.Router({ mergeParams: true });

/***
 * body: slug, name
 */
router.post('/boards', boardController.create);
router.get('/boards', boardController.list);

/***
 * skip - thread offset for pagination
 */
router.get('/boards/:boardSlug/threads', threadController.listByBoard);
router.post('/boards/:boardSlug/threads', threadController.create);

router.get('/threads/:threadId', threadController.get);
router.post('/threads/:threadId/posts', postController.create);
router.patch('/posts/:postId', postController.update);

router.post('/attachments', fileUploadMiddleware, attachmentController.create);
router.delete('/attachments', attachmentController.delete);

export default router;
