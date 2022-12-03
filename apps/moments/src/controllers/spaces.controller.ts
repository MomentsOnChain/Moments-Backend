import { CreateTransactionDto, MongoSpacesService } from '@app/mongoose';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiService } from '../api.service';
import { JwtGuard } from '../auth/guard';
import { SpacesService } from '../space.service';
import { PlanIds } from '@config/plans';

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
  @Get('mySpaces/:id')
  async getMySpace(@Param('id') id: string) {
    const resp = await this.sService.findByUid(id);
    return resp;
  }

  //@ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Buy spaces.',
  })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('buySpaces')
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
