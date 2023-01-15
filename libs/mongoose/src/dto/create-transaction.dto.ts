import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum prices {
  planOne = 1,
  planTwo = 2,
  planThree = 3,
  planFour = 4,
}

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(prices)
  priceId!: string;

  userId!: string;
  spaces!: number;
}
