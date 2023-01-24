import { getSpaceImages } from 'libs/S3/s3';
import { fetchBuffer } from './util';
import { Canvas, loadImage } from 'canvas-constructor/napi-rs';

export const generateImage = async (spaceId: string, spaceSize: number) => {
  const data = (await getSpaceImages(spaceId)) || [];
  const images = await Promise.all(
    data.map(async (image) => {
      console.log(`https://acmmjcet-memorium.s3.amazonaws.com/${image.Key}`);
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
  const imagesPerRow = spaceSize / 10;
  const canvasSize = calculateCanvasSize(images, imagesPerRow);
  const canvas = new Canvas(canvasSize.width, canvasSize.height);

  const x = 0;
  const y = 0;

  images.forEach((image, index) => {
    const { image: img } = image;
    const { width, height } = img;
    const xPosition = x + (index % imagesPerRow) * (width + 3);
    const yPosition = y + Math.floor(index / imagesPerRow) * (height + 3);
    canvas.printImage(img, xPosition, yPosition, width, height);
  });

  return canvas.jpeg();
};

const calculateCanvasSize = (images: any[], imagesPerRow: number) => {
  const widthSorted = images.sort((a, b) => b.image.width - a.image.width);
  const width = widthSorted.slice(0, imagesPerRow).reduce((acc, image) => {
    return acc + image.image.width + 3;
  }, 0);

  const heightSorted = images.sort((a, b) => b.image.height - a.image.height);
  const height = heightSorted.slice(0, imagesPerRow).reduce((acc, image) => {
    return acc + image.image.height + 3;
  }, 0);

  const aspectRatio = width / height;
  return { width, height, aspectRatio };
};
