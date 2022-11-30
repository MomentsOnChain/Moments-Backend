import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@app/mongoose';
import {
  EditUserDto,
  TransactionArray,
  TransactionArrayOut,
} from '../../../config/dto';
import { chunkify } from './utils';

@Injectable()
export class ApiService {
  constructor(
    private userModule: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async isAuthenticated(token: string | undefined) {
    if (!token) return false;
    try {
      const { uid } = this.jwtService.verify(token.replace(/^Bearer\s+/, ''), {
        secret: this.config.get('JWT_SECRET'),
      });
      const exists = await this.userModule.userExists(uid);
      return !!(uid && exists);
    } catch (e) {
      return false;
    }
  }

  async getUser(id: string) {
    const resp = await this.userModule.findOneByUid(id);
    delete resp?.password;
    return resp;
  }

  async getUserByMail(mail: string) {
    const resp = await this.userModule.findOneByEmail(mail);
    delete resp?.password;
    return resp;
  }

  softDelete(id: string) {
    return this.userModule.softDeleteUser(id);
  }

  async updateUser(id: string, data: EditUserDto) {
    const update = {
      first_name: data.first_name,
      last_name: data.last_name,
      'credit_card.ballance': data.credit_card.ballance,
    };
    const a = await this.userModule.updateOneByUid(id, update);
    if (!a) return { message: 'User not found' };
    return a;
  }

  chunkify(data: TransactionArray[]): TransactionArrayOut[] {
    return chunkify(data);
  }
}
