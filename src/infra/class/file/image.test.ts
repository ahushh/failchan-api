import { ImageFile } from './image';
describe("ImageFile class", () => {

    const file = new ImageFile({
        path: './src/__e2e__/integration/attachment/test-image.jpg',
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
        size: 10000,
    });

    it('creates a thumbnail', async () => {
        await file.generateThumbnail();
    });
});