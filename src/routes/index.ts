import { repoMiddleware } from "../middleware/repo";
import { postController } from "../controller/post";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});
router.get('/posts', [repoMiddleware], postController.index);
router.post('/posts', [repoMiddleware], postController.create);


module.exports = router;
