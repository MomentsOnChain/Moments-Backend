import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ISpaces, SpacesSchemaName } from '../schemas/spaces.schema';

@Injectable()
export class MongoSpacesService {
  constructor(
    @InjectModel(SpacesSchemaName)
    private spacesModel: Model<ISpaces>,
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
}
