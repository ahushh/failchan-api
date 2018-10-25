import { EACCES } from 'constants';
import fs from 'fs';
import multer from 'multer';

export const diskStorage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const subdir = Math.random().toString().slice(2);
    const dir = `${process.env.TEMP_DIR || '/tmp'}/attachments/${subdir}`;
    fs.mkdir(dir, undefined, (err) => {
      if (err && err.errno !== EACCES) {
        throw err;
      }
      cb(null, dir);
    });

  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
