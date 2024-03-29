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

  async create(object: any): Promise<ISpaces> {
    const createdSpaces = await new this.spacesModel(object).save();
    return createdSpaces;
  }

  async findOneByUid(_id: string) {
    return this.spacesModel.findOne({ _id }).lean().exec();
  }

  async findByUid(userId: string) {
    return this.spacesModel.find({ userId }).lean().exec();
  }

  async updateNameByUid(_id: string, name: string) {
    const { modifiedCount } = await this.spacesModel
      .updateOne({ _id }, { spaceName: name })
      .lean()
      .exec();
    return modifiedCount;
  }

  async updateOneByUid(_id: string, data: any) {
    return this.spacesModel.updateOne({ _id }, data).lean().exec();
  }

  async createS3Folder(folderId: string) {
    return s3
      .putObject({
        Bucket: this.config.getOrThrow('BUCKET_NAME'),
        Key: `${folderId}/`,
        Body: '',
      })
      .promise();
  }
}
