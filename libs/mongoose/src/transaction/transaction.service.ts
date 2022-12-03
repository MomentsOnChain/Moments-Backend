import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ITransaction,
  TransactionSchemaName,
} from '../schemas/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionSchemaName)
    private transactionModel: Model<ITransaction>,
  ) {}

  async bulkWrite(operations: any[]) {
    return this.transactionModel.bulkWrite(operations);
  }

  async create(createTransaction: ITransaction): Promise<ITransaction> {
    const createdTransaction = await new this.transactionModel(
      createTransaction,
    ).save();
    return createdTransaction;
  }

  async findOneByUid(userId: string) {
    return this.transactionModel.findOne({ userId }).exec();
  }

  async findByUid(userId: string) {
    return this.transactionModel.find({ userId }).exec();
  }

  async updateOneByUid(transactionId: string, update: any) {
    return this.transactionModel
      .findOneAndUpdate({ transactionId }, update)
      .exec();
  }
}
