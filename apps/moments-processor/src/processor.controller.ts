import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TcpEvents } from '../../../config/tcp.enums';
import { TransactionArrayOut } from '../../../config/dto';
import { MomentsService } from './processor.service';

@Controller()
export class MomentsController {
  constructor(private readonly service: MomentsService) {}

  @EventPattern(TcpEvents.ProcessChunk)
  process(chunk: TransactionArrayOut[]) {
    return this.service.process(chunk);
  }
}
