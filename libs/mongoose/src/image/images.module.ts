import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImagesSchema, ImagesSchemaName } from '../schemas/images.schema';
import { MongoImagesService } from './images.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImagesSchemaName, schema: ImagesSchema },
    ]),
  ],
  exports: [
    MongoImagesService,
    MongooseModule.forFeature([
      { name: ImagesSchemaName, schema: ImagesSchema },
    ]),
  ],
  providers: [MongoImagesService],
})
export class ImagesModule {}
