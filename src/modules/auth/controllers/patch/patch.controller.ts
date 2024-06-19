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

  @Patch("/edit-profile/:username")
  @UseGuards(AuthGuard())
  editProfile(
    @GetUser() user: UserEntity,
    @Param("username") username: string,
    @Body(ValidationPipe) userDto: UserDto
  ) {
    console.log("userDto: ", userDto);
    return user.role > 1
      ? this.authService.editProfile(username, userDto)
      : this.authService.editProfile(user.username, userDto);
  }
}
