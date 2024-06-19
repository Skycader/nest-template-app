import { Optional } from "@nestjs/common";
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UserDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  midname: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  surname: string;

  @IsOptional()
  @IsNumberString()
  @MaxLength(13)
  birthdate: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  telephone: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  information: string;
}
