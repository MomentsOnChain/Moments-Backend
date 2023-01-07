import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Stripe from 'stripe';
import { UserService } from '@app/mongoose';
import { s3 } from 'libs/S3/s3';

@Injectable()
export class ApiService {
  constructor(
    private userModule: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  stripe = new Stripe(this.config.getOrThrow('STRIPE_SEC_KEY'), {
    apiVersion: '2022-11-15',
  });

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

  async updateUser(id: string, data: any) {
    const a = await this.userModule.updateOneByUid(id, data);
    if (!a) return { message: 'User not found' };
    return a;
  }

  async generateSignedUrl(filename: string) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Expires: 60 * 5,
    };
    try {
      const url: string = await new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (err, url) => {
          err ? reject(err) : resolve(url);
        });
      });
      return url;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
