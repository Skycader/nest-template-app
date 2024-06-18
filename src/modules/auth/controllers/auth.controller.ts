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
import { AuthService } from "../services/auth.service";
import { AuthCredentialsDto } from "../dtos/auth-credentials.dto";
import { UserEntity } from "../entities/user.entity";
import { GetUser } from "../decorators/get-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("/signup")
  signUp(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto
  ) {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post("/sign-in")
  signInWithPassword(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signInWithPassword(authCredentialsDto);
  }

  @Post("/check-token")
  @UseGuards(AuthGuard())
  checkToken(@GetUser() user: UserEntity) {
    return {
      username: user.username,
      name: user.name,
      midname: user.midname,
      surname: user.surname,
      role: user.role,
      telephone: user.telephone,
      birthdate: user.birthdate,
      information: user.information,
    };
  }
}
