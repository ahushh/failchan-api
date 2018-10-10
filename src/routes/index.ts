import { postController } from '../controller/post';
import { autoBindModelMiddleware } from '../middleware/autobind-model';

import express from 'express';

// declare global {
//   namespace Express {
//     export interface Request {
//        context: any;
//     }
//   }
// }

const router = express.Router({ mergeParams: true });

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ title: 'Express' });
});
router.get('/posts', [autoBindModelMiddleware()], postController.index);
router.post('/posts', [autoBindModelMiddleware()], postController.create);
router.get('/posts/:postId', [autoBindModelMiddleware()], postController.get);

export default router;
