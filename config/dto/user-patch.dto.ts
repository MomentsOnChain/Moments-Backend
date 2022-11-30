import { IsNotEmpty, IsString, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class CreditCard {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ballance!: number;

  @ApiProperty()
  cc_number?: number;
}

export class EditUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @ApiProperty({
    type: CreditCard,
  })
  @IsObject()
  @Type(() => CreditCard)
  credit_card!: CreditCard;
}
