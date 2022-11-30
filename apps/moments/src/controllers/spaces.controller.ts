import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MicroServices } from '../../../../config/tcp.enums';
import { ApiService } from '../api.service';
import { JwtGuard } from '../auth/guard';

@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
  constructor(
    private readonly apiService: ApiService,
    @Inject(MicroServices.Processor)
    private readonly communicationClient: ClientProxy,
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
  @Get('mySpaces')
  async getMySpace(@Param('id') id: string) {
    const resp = await this.apiService.getUser(id);
    return resp;
  }
}
