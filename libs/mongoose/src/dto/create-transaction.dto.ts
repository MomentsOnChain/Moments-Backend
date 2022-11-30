import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsNotEmpty()
  @IsNumber()
  spacesBought!: number;

  @IsNotEmpty()
  @IsBoolean()
  success!: boolean;
}
