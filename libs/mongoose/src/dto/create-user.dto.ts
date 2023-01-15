import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsString()
  avatar!: string;
}

export class TokenDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  token!: string;
}

export class acknowledgeImageDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  url!: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  spaceId!: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  metaData!: string;
}
