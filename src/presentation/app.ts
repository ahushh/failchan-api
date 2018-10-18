
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import routes from './routes';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((err, req, res, next) => {
  console.log('govno');
  res.status(500).json({ error: err });
});
app.use('/', routes);

export default app;
