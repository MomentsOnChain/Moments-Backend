import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TransactionSchema,
  TransactionSchemaName,
} from '../schemas/transaction.schema';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionSchemaName, schema: TransactionSchema },
    ]),
  ],
  exports: [
    TransactionService,
    MongooseModule.forFeature([
      { name: TransactionSchemaName, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionService],
})
export class TransactionModule {}
