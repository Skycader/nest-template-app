import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsNumberString } from 'class-validator';
import { UserRolesEnum } from '../models/roles.enum';

export class UpdateRoleDto {
  @ApiProperty()
  @IsNumber()
  @IsIn([UserRolesEnum.User, UserRolesEnum.Moderator])
  role: UserRolesEnum;
}
