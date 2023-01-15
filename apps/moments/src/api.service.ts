import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Stripe from 'stripe';
import {
  MongoSpacesService,
  UserService,
  MongoSignedService,
} from '@app/mongoose';
import { s3 } from 'libs/S3/s3';
import { Types } from 'mongoose';
const logger = new Logger('ApiService');

@Injectable()
export class ApiService {
  constructor(
    private userModule: UserService,
    private spaceService: MongoSpacesService,
    private jwtService: JwtService,
    private signedUrlService: MongoSignedService,
    private config: ConfigService,
  ) {}
  stripe = new Stripe(this.config.getOrThrow('STRIPE_SEC_KEY'), {
    apiVersion: '2022-11-15',
  });

  async isAuthenticated(token: string | undefined) {
    if (!token) return { authenticated: false };
    try {
      const { uid }: { uid: string } = this.jwtService.verify(
        token.replace(/^Bearer\s+/, ''),
        {
          secret: this.config.get('JWT_SECRET'),
        },
      );
      const exists = await this.userModule.userExists(uid);
      return { authenticated: !!(uid && exists), uid };
    } catch (e) {
      return { authenticated: false };
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

  async generateSignedUrl(spaceId: string, userId: string) {
    if (!Types.ObjectId.isValid(spaceId)) {
      return {
        message: 'Invalid space _id',
      };
    }

    const [{ Contents }, space] = await Promise.all([
      s3
        .listObjects({
          Bucket: process.env.BUCKET_NAME!,
          Prefix: spaceId + '/',
        })
        .promise(),
      this.spaceService.findOneByUid(spaceId),
    ]);
    if (!space) return { message: 'Space not found' };
    if (!Contents) return { message: 'Something went wrong. Try again later.' };
    Contents.shift();
    if (Contents?.length >= space.spaceSize)
      return { message: `Max ${space.spaceSize} images per space` };

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${spaceId}/${userId}.jpg`,
      Expires: 60 * 5,
    };
    try {
      const url: string = await new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, (err, url) => {
          err ? reject(err) : resolve(url);
        });
      });
      await this.signedUrlService.create({
        userId,
        expire: new Date(Date.now() + 60 * 5 * 1000),
        signedUrl: url,
      });
      return url;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }
}
