import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';

import { CreateUserDto, UserService } from '@app/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userModule: UserService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const hash = await argon.hash(dto.password);
    dto.password = hash;
    try {
      const user = await this.userModule.create(dto);
      if (user) return this._signToken(user._id, user.email);
    } catch (error: any) {
      if (error?.code === 11000)
        throw new BadRequestException('User already exists');
      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    // find the user by email
    const user = await this.userModule.findOneByEmail(dto.email);
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('User Does Not exists.');

    // compare password
    const pwMatches = await argon.verify(user.password ?? '', dto.password);

    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return this._signToken(user._id, user.email);
  }

  async _signToken(
    userId: Types.ObjectId | undefined,
    email: string | undefined,
  ): Promise<{ access_token: string; _id: string }> {
    if (!userId || !email) throw new BadRequestException('Invalid user');
    const payload = {
      uid: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });

    return {
      access_token: token,
      _id: userId.toString(),
    };
  }
}
