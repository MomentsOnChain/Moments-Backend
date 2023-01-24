import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class SpacesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId!: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;
}
