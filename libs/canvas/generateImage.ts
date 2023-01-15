import { getSpaceImages } from 'libs/S3/s3';
import { fetchBuffer } from './util';
import { Canvas, loadImage } from 'canvas-constructor/napi-rs';
import { writeFile } from 'fs/promises';

export const generateImage = async (spaceId: string) => {
  const data = (await getSpaceImages(spaceId)) || [];
  const images = await Promise.all(
    data.map(async (image) => {
      const buffer = await fetchBuffer(
        `https://acmmjcet-memorium.s3.amazonaws.com/${image.Key}`,
      );
      return {
        buffer,
        image: await loadImage(buffer as Buffer),
        key: image.Key,
      };
    }),
  );

  const a = calculateCanvasSize(images);
  const canvas = new Canvas(a.width, a.height);

  let x = 0;
  let y = 0;
  let maxHeight = 0;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const { width, height } = image.image;

    if (x + width > canvas.width) {
      x = 0;
      y += maxHeight + 2;
      maxHeight = 0;
    }

    canvas.printImage(image.image, x + 2, y + 2, width, height);
    x += width + 2;
    maxHeight = Math.max(maxHeight, height);
  }
  writeFile('test.png', canvas.png());
  return images;
};

const calculateCanvasSize = (images: any[]) => {
  const width = images.reduce((acc, image) => {
    return acc + image.image.width + 3;
  }, 0);
  const height = images.reduce((acc, image) => {
    return acc + image.image.height + 3;
  }, 0);
  const aspectRatio = width / height;
  return { width, height, aspectRatio };
};
