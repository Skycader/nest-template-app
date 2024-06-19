import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class UserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  midname: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  surname: string;

  @IsNumber()
  @MinLength(13)
  @MaxLength(13)
  birthdate: number;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  telephone: string;

  @IsNumber()
  @MinLength(1)
  @MaxLength(2)
  role: number;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  information: string;
}
