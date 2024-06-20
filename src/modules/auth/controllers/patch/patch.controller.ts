import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../../services/auth.service";
import { IsModeratorGuard } from "../../guards/is-moderator.guard";
import { UserEntity } from "../../entities/user.entity";
import { GetUser } from "../../decorators/get-user.decorator";
import { UserDto } from "../../dtos/user.dto";

/** @TODO
 * Remove fucking anys
 *
 */
@Controller("auth")
export class AuthPatchController {
  constructor(private authService: AuthService) { }

  @Patch("/edit-current-profile")
  @UseGuards(AuthGuard())
  editCurrentProfile(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) userDto: UserDto
  ) {
    return this.authService.editProfile(user.username, userDto);
  }

  @Patch("/edit-profile/:username")
  @UseGuards(AuthGuard(), IsModeratorGuard)
  editProfile(
    @GetUser() user: UserEntity,
    @Param("username") username: string,
    @Body(ValidationPipe) userDto: UserDto
  ) {
    return this.authService.editProfile(username, userDto);
  }
}
