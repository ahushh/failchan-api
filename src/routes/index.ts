import { postController } from "../controller/post";
import { autoBindModelMiddleware } from "../middleware/autobind-model";
import { Container } from 'typedi';
import { Post } from '../entity/post';
import { AutobindRoutesService } from '../services/autobind-routes';

var express = require('express');
var router = express.Router({mergeParams: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});
router.get('/posts', [autoBindModelMiddleware()], postController.index);
router.post('/posts', [autoBindModelMiddleware()], postController.create);
router.get('/posts/:postId', [autoBindModelMiddleware()], postController.get);

module.exports = router;
