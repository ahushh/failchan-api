import config from 'config';
import { EACCES } from 'constants';
import fs from 'fs';
import multer from 'multer';

const TMP_DIR = config.get<string>('file.tmpDir');
export const diskStorage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const timestamp = + new Date();
    const subdir = timestamp + Math.random().toString().slice(2);
    const dir = `${TMP_DIR}/${subdir}`;
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
