import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../../services/auth.service";
import { AuthCredentialsDto } from "../../dtos/auth-credentials.dto";
import { IsModeratorGuard } from "../../guards/is-moderator.guard";
import { GetUser } from "../../decorators/get-user.decorator";
import { UserEntity } from "../../entities/user.entity";

@Controller("auth.get")
export class AuthGetController {
  constructor(private authService: AuthService) { }

  @Get("user")
  public getUser(@GetUser() user: UserEntity) {
    return user;
  }

  @Get("/user/:username/:page")
  @UseGuards(AuthGuard(), IsModeratorGuard)
  findUser(
    @Query() query: string,
    @Param("username") username: string,
    @Param("page") page: number
  ) {
    console.log(query);
    return this.authService.findUser(username, page, query);
  }

  @Get("/get-role")
  @UseGuards(AuthGuard())
  getRole(@GetUser() user: UserEntity) {
    return {
      role: user.role,
    };
  }

  @Get("/get-profile-by-moderator/:username")
  @UseGuards(AuthGuard(), IsModeratorGuard)
  getProfileByModerator(@Param("username") username: string) {
    return this.authService.findUser(username, 1);
  }
}
