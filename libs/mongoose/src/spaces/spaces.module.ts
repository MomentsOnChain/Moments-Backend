import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SpacesSchema, SpacesSchemaName } from '../schemas/spaces.schema';
import { MongoSpacesService } from './spaces.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpacesSchemaName, schema: SpacesSchema },
    ]),
  ],
  exports: [
    MongoSpacesService,
    MongooseModule.forFeature([
      { name: SpacesSchemaName, schema: SpacesSchema },
    ]),
  ],
  providers: [MongoSpacesService],
})
export class SpacesModule {}
