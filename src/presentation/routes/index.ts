import express, { Router } from 'express';

import { postController } from '../controller/post';
import { boardController } from '../controller/board';
import { threadController } from '../controller/thread';
import { fileUploadMiddleware } from '../middleware/file-upload';
import { attachmentController } from '../controller/attachment';

const router: Router = express.Router({ mergeParams: true });

/***
 * body: slug, name
 */
router.post('/boards', boardController.create);
router.get('/boards', boardController.list);

router.get('/boards/:boardSlug/threads', threadController.listByBoard);
router.post('/boards/:boardSlug/threads', threadController.create);

router.post('/threads/:threadId/posts', postController.create);
// router.get('/threads/:threadId/posts', postController.list);
router.post('/attachments', fileUploadMiddleware, attachmentController.create);

export default router;
