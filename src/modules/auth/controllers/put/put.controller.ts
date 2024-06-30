import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Put,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../../services/auth.service";
import { IsAdminGuard } from "../../guards/is-admin.guard";
import { UpdateRoleDto } from "../../dtos/update-role.dto";

@Controller("auth")
export class AuthPutController {
  constructor(private authService: AuthService) {}

  @Put("/update-role/:username")
  @UseGuards(AuthGuard(), IsAdminGuard)
  public async patchRole(
    @Param("username") username: string,
    @Body(ValidationPipe) patch: UpdateRoleDto
  ) {
    if (username === "admin")
      throw new BadRequestException("Admin cannot self kill");
    const status = await this.authService.updateRole(username, patch.role);
    return { status };
  }
}
