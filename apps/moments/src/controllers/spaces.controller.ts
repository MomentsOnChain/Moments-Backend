import { CreateTransactionDto, MongoSpacesService } from '@app/mongoose';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { SpacesService } from '../space.service';
import { PlanIds } from '@config/plans';
import { generateImage } from 'libs/canvas/generateImage';
import { FastifyRequest } from 'fastify';
import { ApiService } from '../api.service';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
  constructor(
    private readonly apiService: ApiService,
    private readonly spacesService: SpacesService,
    private readonly sService: MongoSpacesService,
  ) {
    // todo: add logic and integration with microservice for stripe payment
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns all of the spaces bought by authenticated user.',
  })
  // @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('my_spaces')
  async getMySpace(@Headers() headers: FastifyRequest['headers']) {
    const { uid } = await this.apiService.isAuthenticated(
      headers.authorization,
    );
    if (!uid) return { message: 'Invalid token' };
    const resp = await this.sService.findByUid(uid);
    await generateImage('63c09e2818c68eee133084fd');
    return resp;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Buy spaces.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('buy_spaces')
  async buySpaces(@Body() body: CreateTransactionDto) {
    const priceId = PlanIds[body.priceId as keyof typeof PlanIds];
    if (priceId === undefined) return { message: 'Invalid priceId' };
    const resp = await this.spacesService.handler({
      priceId: priceId.id,
      spaces: priceId.spaces,
      userId: body.userId,
    });
    return resp;
  }
}
