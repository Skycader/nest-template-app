import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  midname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  surname: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @MaxLength(13)
  birthdate: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  telephone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  information: string;
}
