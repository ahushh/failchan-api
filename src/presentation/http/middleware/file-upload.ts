import config from 'config';
import multer from 'multer';
import { APP_ERRORS } from '../../../app/errors/error.interface';
import { diskStorage } from './file-upload/disk-storage';

const files = config.get<number>('file.maxNumber');
const fileSize = config.get<number>('file.maxUploadSize');

export const fileUploadMiddleware = (req, res, next) => multer({
  storage: diskStorage,
  limits: {
    fileSize,
    files,
    parts: files,
  },
}).array('attachments')(req, res, (err) => {
  if (err) {
    res.status(422).json({ name: APP_ERRORS.UploadError, message: err.message, details: err });
  } else {
    next();
  }
});
