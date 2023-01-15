import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IImages, ImagesSchemaName } from '../schemas/images.schema';

@Injectable()
export class MongoImagesService {
  constructor(
    @InjectModel(ImagesSchemaName)
    private signedModel: Model<IImages>,
  ) {}

  async bulkWrite(operations: any[]) {
    return this.signedModel.bulkWrite(operations);
  }

  async create(object: any): Promise<IImages> {
    const createdSpaces = await new this.signedModel(object).save();
    return createdSpaces;
  }

  async findOneByUid(_id: string) {
    return this.signedModel.findOne({ _id }).lean().exec();
  }

  async findByUid(userId: string) {
    return this.signedModel.find({ userId }).lean().exec();
  }
}
