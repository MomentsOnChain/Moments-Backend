import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TransactionSchema,
  TransactionSchemaName,
} from '../schemas/transaction.schema';
import { MongoSpacesService } from './spaces.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionSchemaName, schema: TransactionSchema },
    ]),
  ],
  exports: [
    MongoSpacesService,
    MongooseModule.forFeature([
      { name: TransactionSchemaName, schema: TransactionSchema },
    ]),
  ],
  providers: [MongoSpacesService],
})
export class SpacesModule {}
