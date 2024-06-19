import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../../services/auth.service";
import { IsModeratorGuard } from "../../guards/is-moderator.guard";
import { GetUser } from "../../decorators/get-user.decorator";
import { UserEntity } from "../../entities/user.entity";
import { UserSearchConfigInterface } from "../../models/user-search.config";

@Controller("auth")
export class AuthGetController {
  constructor(private authService: AuthService) { }

  @Get("current-user")
  @UseGuards(AuthGuard())
  public getUser(@GetUser() user: UserEntity) {
    return user;
  }

  @Get("/user/:username/:page")
  @UseGuards(AuthGuard(), IsModeratorGuard)
  findUser(
    @Query() query: UserSearchConfigInterface,
    @Param("username") username: string,
    @Param("page") page: number
  ) {
    console.log(query);
    return this.authService.findUser(username, page, query);
  }
}
