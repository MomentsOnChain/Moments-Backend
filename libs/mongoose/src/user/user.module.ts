import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema, UserSchemaName } from '../schemas/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserSchemaName, schema: UserSchema }]),
  ],
  exports: [
    UserService,
    MongooseModule.forFeature([{ name: UserSchemaName, schema: UserSchema }]),
  ],
  providers: [UserService],
})
export class UserModule {}
