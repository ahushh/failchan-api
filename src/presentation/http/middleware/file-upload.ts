import multer from 'multer';
import { diskStorage } from './file-upload/disk-storage';

const files = process.env.MAX_UPLOAD_FILES
  ? +process.env.MAX_UPLOAD_FILES
  : 5;

const fileSize = process.env.MAX_UPLOAD_FILE_SIZE
  ? +process.env.MAX_UPLOAD_FILE_SIZE
  : 1024 * 1024 * 10; // 10 MB

export const fileUploadMiddleware = multer({
  storage: diskStorage,
  limits: {
    fileSize,
    files,
    parts: files,
  },
}).array('attachments');
