import fs from 'fs';
export const checkTmpDir = () => {
  const tmpDir = process.env.TEMP_DIR as string;
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }
};
