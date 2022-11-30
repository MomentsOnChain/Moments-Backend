import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, AnyObject } from 'mongoose';

import type { CreateUserDto } from '../dto/create-user.dto';
import { IUser, UserSchemaName } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchemaName)
    private userModel: Model<IUser>,
  ) {}

  async bulkWrite(operations: any[]) {
    return this.userModel.bulkWrite(operations);
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const userExists = await this.userModel
      .findOne({ email: createUserDto.email, deleted: false })
      .lean()
      .exec();
    if (!userExists) {
      const createdUser = await new this.userModel(createUserDto).save();
      return createdUser;
    } else {
      return userExists;
    }
  }

  userExists(uid: string) {
    return this.userModel.exists({ uid, deleted: false }).exec();
  }

  async findOneByUid(uid: string) {
    return this.userModel.findOne({ uid }).lean().exec();
  }

  async updateOneByUid(uid: string, data: AnyObject) {
    return this.userModel
      .findOneAndUpdate({ uid, deleted: false }, data, { new: true })
      .lean()
      .exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email, deleted: false }).lean().exec();
  }

  async findOneByUserName(username: string) {
    return this.userModel.findOne({ username, deleted: false }).lean().exec();
  }

  async softDeleteUser(uid: string): Promise<{ deleted: boolean }> {
    const response = await this.userModel
      .updateOne({ uid }, { deleted: true })
      .lean()
      .exec();
    return { deleted: response.acknowledged && response.modifiedCount > 0 };
  }
}
