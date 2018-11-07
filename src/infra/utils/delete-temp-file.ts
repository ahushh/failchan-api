import path from 'path';
import rimraf from 'rimraf';
import util from 'util';

export const deleteFileSubdir = (filePath: string): Promise<void> => {
  const pathChunks = filePath.split(path.sep);
  const subdir = pathChunks.splice(0, pathChunks.length - 1).join(path.sep);
  return util.promisify(rimraf)(subdir);
};
