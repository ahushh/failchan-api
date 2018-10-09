import { postsRouter } from "./routes/posts";
import { repoMiddleware } from "./middleware/repo";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next) {
  res.status(500).json({ error: err });
});
app.use('/', indexRouter);

module.exports = app;
