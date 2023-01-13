import { Controller, Get, Param, UseGuards, HttpCode } from '@nestjs/common';
import { ApiService } from '../api.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly apiService: ApiService) {}

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
}
