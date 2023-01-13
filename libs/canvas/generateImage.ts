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

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const { width, height } = image.image;
    const x = images.slice(0, i).reduce((acc, image) => {
      return acc + image.image.width;
    }, 0);
    const y = images.slice(0, i).reduce((acc, image) => {
      return acc + image.image.height;
    }, 0);
    canvas.printImage(image.image, x, y, width, height);
  }
  writeFile('test.png', canvas.png());
  return images;
};

// calculate width, height and aspect ratio of the canvas based upon the images
const calculateCanvasSize = (images: any[]) => {
  const width = images.reduce((acc, image) => {
    return acc + image.image.width;
  }, 0);
  const height = images.reduce((acc, image) => {
    return acc + image.image.height;
  }, 0);
  const aspectRatio = width / height;
  return { width, height, aspectRatio };
};
