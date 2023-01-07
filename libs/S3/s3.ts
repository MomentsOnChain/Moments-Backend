import { S3 } from 'aws-sdk';

export const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

export const getSpaceImages = async (spaceId: string) => {
  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Prefix: spaceId + '/',
  };
  const data = await s3.listObjects(params).promise();
  return data.Contents;
};
