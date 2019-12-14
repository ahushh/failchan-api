import fs from 'fs';
import { promisify } from 'util';

import { ImageFile } from '../image';

describe('ImageFile class', () => {

  const file = new ImageFile({
    path: './src/infra/class/file/__test__/test-image.jpg',
    originalname: 'image.jpg',
    mimetype: 'image/jpeg',
    size: 10000,
  });

  it('creates a thumbnail without error', async () => {
    await file.generateThumbnail();
    await promisify(fs.writeFile)('/tmp/test-thumbnail.jpg', file.thumbnail);
  });
});
