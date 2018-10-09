import { repoMiddleware } from "../middleware/repo";
import { postController } from "../controller/post";
import { autoBindModelMiddleware } from "../middleware/autobind-model";

var express = require('express');
var router = express.Router({mergeParams: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});
router.get('/posts', [repoMiddleware], postController.index);
router.post('/posts', [repoMiddleware], postController.create);
router.get('/posts/:postId', [repoMiddleware, autoBindModelMiddleware], postController.get);

module.exports = router;
