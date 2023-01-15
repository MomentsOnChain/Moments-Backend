import { CreateTransactionDto, MongoSpacesService } from '@app/mongoose';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Headers,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { SpacesService } from '../space.service';
import { PlanIds } from '@config/plans';
import { generateImage } from 'libs/canvas/generateImage';
import { FastifyRequest } from 'fastify';
import { ApiService } from '../api.service';
import { getSpaceImages } from 'libs/S3/s3';

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
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('my_spaces')
  async getMySpace(@Headers() headers: FastifyRequest['headers']) {
    const { uid } = await this.apiService.isAuthenticated(
      headers.authorization,
    );
    if (!uid) return { message: 'Invalid token' };
    const resp = await this.sService.findByUid(uid);
    await generateImage('63c09e2818c68eee133084fd', 100);
    return resp;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Update the name of the space.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Patch('my_spaces/:space_id/:space_name')
  async updateSpaceName(
    @Param('space_id') space_id: string,
    @Param('space_name') space_name: string,
  ) {
    const resp = await this.sService.updateOneByUid(space_id, space_name);
    if (resp === 1) return { message: 'Space name updated' };
    return { message: 'Space not found' };
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns all of the images in the space.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('my_spaces/:space_id')
  async spaceImages(@Param('space_id') space_id: string) {
    const spaceImages = await getSpaceImages(space_id);
    if (!spaceImages) return { message: 'Space not found' };
    return {
      spaceImages: spaceImages.map(
        (image) => `https://acmmjcet-memorium.s3.amazonaws.com/${image.Key}`,
      ),
    };
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Buy spaces.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('buy_spaces')
  async buySpaces(
    @Body() body: CreateTransactionDto,
    @Headers() headers: FastifyRequest['headers'],
  ) {
    const priceId = PlanIds[body.priceId as keyof typeof PlanIds];
    if (priceId === undefined) return { message: 'Invalid priceId' };
    const { uid } = await this.apiService.isAuthenticated(
      headers.authorization,
    );
    if (!uid) return { message: 'Invalid token' };
    const resp = await this.spacesService.handler({
      priceId: priceId.id,
      spaces: priceId.spaces,
      userId: uid,
    });
    return resp;
  }
}
