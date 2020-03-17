import config from 'config';
import fs from 'fs';
export const checkTmpDir = () => {
  const tmpDir = config.get<string>('file.tmpDir');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }
};
