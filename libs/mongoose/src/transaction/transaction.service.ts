import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { CreateTransactionDto } from '../dto/create-transaction.dto';
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

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<ITransaction> {
    const createdTransaction = await new this.transactionModel(
      createTransactionDto,
    ).save();
    return createdTransaction;
  }

  async findOneByUid(userId: string) {
    return this.transactionModel.findOne({ userId }).exec();
  }

  async findByUid(userId: string) {
    return this.transactionModel.find({ userId }).exec();
  }
}
