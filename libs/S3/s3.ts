import { S3 } from 'aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});

const config = new ConfigService();
export const s3 = new S3({
  accessKeyId: config.getOrThrow('accessKeyId'),
  secretAccessKey: config.getOrThrow('secretAccessKey'),
  region: config.getOrThrow('region'),
});

export const getSpaceImages = async (spaceId: string) => {
  const params = {
    Bucket: config.getOrThrow('BUCKET_NAME'),
    Prefix: spaceId + '/',
  };
  const data = await s3.listObjectsV2(params).promise();
  data.Contents?.shift();
  return data.Contents;
};
