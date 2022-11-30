import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type TransactionArrayOut = {
  totalValue: number;
  timeLeft: number;
  transactions: { value: number; latency: number; userId: string }[];
};

export class TransactionArray {
  @IsNumber()
  @ApiProperty()
  value!: number;

  @ApiProperty()
  @IsNumber()
  latency!: number;

  @ApiProperty()
  @IsString()
  userId!: string;
}

export class TransactionArrayInput {
  @ApiProperty({
    type: [TransactionArray],
    description: 'Array of transactions',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionArray)
  data!: TransactionArray[];
}
