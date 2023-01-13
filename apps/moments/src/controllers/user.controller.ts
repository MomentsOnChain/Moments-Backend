import { Controller, Get, Param, UseGuards, HttpCode } from '@nestjs/common';
import { ApiService } from '../api.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Body, Post } from '@nestjs/common/decorators';
import { TokenDto } from '@app/mongoose';
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly apiService: ApiService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns a user object',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get(':_id')
  async getUser(@Param('_id') id: string) {
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
  // @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('signedUrl/:_spaceId/:_userId')
  async generateSignedUrl(
    @Param('_spaceId') spaceId: string,
    @Param('_userId') userId: string,
  ) {
    const resp = await this.apiService.generateSignedUrl(spaceId, userId);
    if (!resp) return { message: 'Something went wrong. Try again later.' };
    return { url: resp };
  }

  @ApiResponse({
    status: 200,
    description: 'Validate a token',
  })
  @HttpCode(200)
  @Post('validateToken')
  async validateToken(@Body() { token }: TokenDto) {
    try {
      const resp = verify(token, this.configService.getOrThrow('JWT_SECRET'));
      return { valid: true, payload: resp };
    } catch {
      return { valid: false, payload: null };
    }
  }
}
