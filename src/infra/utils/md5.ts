import fs from 'fs';
import md5 from 'md5';

export const calculateMd5ForFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buff) => {
      if (err) {
        reject(err);
      }
      resolve(md5(buff));
    });
  });
};
