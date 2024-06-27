import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../services/auth.service';
import { IsModeratorGuard } from '../../guards/is-moderator.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { UserSearchConfigInterface } from '../../models/user-search.config';

@Controller('auth')
export class AuthGetController {
  constructor(private authService: AuthService) { }

  @Get('current-user')
  @UseGuards(AuthGuard())
  public getCurrentUser(@GetUser() user: UserEntity) {
    return this.authService.getUser(user.username);
  }

  @Get('/user/:username')
  @UseGuards(AuthGuard(), IsModeratorGuard)
  getUser(@Param('username') username: string) {
    console.log(username);
    return this.authService.getUser(username);
  }

  @Get('/users')
  @UseGuards(AuthGuard(), IsModeratorGuard)
  findUser(@Query() query: UserSearchConfigInterface) {
    return this.authService.searchUsers(query);
  }
}
