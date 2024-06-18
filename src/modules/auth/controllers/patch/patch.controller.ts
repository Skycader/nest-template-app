import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../../services/auth.service";
import { IsModeratorGuard } from "../../guards/is-moderator.guard";
import { UserEntity } from "../../entities/user.entity";
import { GetUser } from "../../decorators/get-user.decorator";

@Controller("auth.patch")
export class AuthPatchController {
  constructor(private authService: AuthService) { }

  @Patch("/edit-profile")
  @UseGuards(AuthGuard())
  editProfile(
    @GetUser() user: UserEntity,
    @Body("profileData") profileDataDto: any
  ) {
    return this.authService.editProfile(user.username, profileDataDto);
  }

  @Patch("/edit-profile-by-moderator/:username")
  @UseGuards(AuthGuard(), IsModeratorGuard)
  editProfileByModerator(
    @Param("username") username: string,
    @Body("profileData") profileDataDto: any
  ) {
    return this.authService.editProfileByModerator(username, profileDataDto);
  }
}
