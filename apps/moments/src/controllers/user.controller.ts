import { Controller, Get, Param, UseGuards, HttpCode } from '@nestjs/common';
import { ApiService } from '../api.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Body, Post } from '@nestjs/common/decorators';
import { MongoImagesService, TokenDto } from '@app/mongoose';
import { Headers } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly apiService: ApiService,
    private readonly configService: ConfigService,
    private readonly imageService: MongoImagesService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns a user object',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get(':_id')
  async getUser(@Param('user_id') id: string) {
    const resp = await this.apiService.getUser(id);
    return resp;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns a user object with email',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('email/:email')
  async getUserByMail(@Param('email') id: string) {
    const resp = await this.apiService.getUserByMail(id);
    return resp;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns a signed url for s3 upload',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('signed_url/:space_id')
  async generateSignedUrl(
    @Headers() headers: FastifyRequest['headers'],
    @Param('_spaceId') spaceId: string,
  ) {
    const { uid } = await this.apiService.isAuthenticated(
      headers.authorization,
    );
    if (!uid) return { message: 'Invalid token' };
    const resp = await this.apiService.generateSignedUrl(spaceId, uid);
    if (!resp) return { message: 'Something went wrong. Try again later.' };
    return { url: resp };
  }

  @ApiResponse({
    status: 200,
    description: 'Validate a token',
  })
  @HttpCode(200)
  @Post('validate_token')
  async validateToken(@Body() { token }: TokenDto) {
    try {
      const resp = verify(token, this.configService.getOrThrow('JWT_SECRET'));
      return { valid: true, payload: resp };
    } catch {
      return { valid: false, payload: null };
    }
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   status: 200,
  //   description: 'Acknowledge image upload from signed url',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       url: {
  //         type: 'string',
  //       },
  //       userId: {
  //         type: 'string',
  //       },
  //       spaceId: {
  //         type: 'string',
  //       },
  //       metaData: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // @UseGuards(JwtGuard)
  // @HttpCode(200)
  // @Post('acknowledge_image_upload')
  // async acknowledgeImageUpload() {
  //   // object: acknowledgeImageDto, //@Body()
  //   return {
  //     message: 'acknowledged',
  //   };
  // }
}
