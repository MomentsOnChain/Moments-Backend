import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { s3 } from 'libs/S3/s3';

import { ISpaces, SpacesSchemaName } from '../schemas/spaces.schema';

@Injectable()
export class MongoSpacesService {
  constructor(
    @InjectModel(SpacesSchemaName)
    private spacesModel: Model<ISpaces>,
    private config: ConfigService,
  ) {}

  async bulkWrite(operations: any[]) {
    return this.spacesModel.bulkWrite(operations);
  }

  async create(createTransactionDto: any): Promise<ISpaces> {
    const createdSpaces = await new this.spacesModel(
      createTransactionDto,
    ).save();
    return createdSpaces;
  }

  async findOneByUid(userId: string) {
    return this.spacesModel.findOne({ userId }).exec();
  }

  async findByUid(userId: string) {
    return this.spacesModel.find({ userId }).exec();
  }

  async createS3Folder(folderId: string) {
    return s3.putObject({
      Bucket: this.config.getOrThrow('BUCKET_NAME'),
      Key: `${folderId}/`,
      Body: '',
      ContentType: 'application/x-directory',
    });
  }
}
