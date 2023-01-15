import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ISigned, SignedSchemaName } from '../schemas/signed.schema';

@Injectable()
export class MongoSignedService {
  constructor(
    @InjectModel(SignedSchemaName)
    private signedModel: Model<ISigned>,
  ) {}

  async bulkWrite(operations: any[]) {
    return this.signedModel.bulkWrite(operations);
  }

  async create(object: any): Promise<ISigned> {
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
