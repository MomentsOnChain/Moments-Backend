import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SignedSchema, SignedSchemaName } from '../schemas/signed.schema';
import { MongoSignedService } from './signed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SignedSchemaName, schema: SignedSchema },
    ]),
  ],
  exports: [
    MongoSignedService,
    MongooseModule.forFeature([
      { name: SignedSchemaName, schema: SignedSchema },
    ]),
  ],
  providers: [MongoSignedService],
})
export class SignedModule {}
