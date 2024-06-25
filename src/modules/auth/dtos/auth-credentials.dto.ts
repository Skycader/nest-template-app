import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is too weak',
  // })
  password?: string;
}
