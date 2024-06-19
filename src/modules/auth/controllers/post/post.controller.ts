import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { AuthCredentialsDto } from "../../dtos/auth-credentials.dto";

@Controller("auth")
export class AuthPostController {
  constructor(private authService: AuthService) { }

  @Post("/sign-up")
  async signUp(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto
  ) {
    const status = await this.authService.signUp(authCredentialsDto);
    if (status === 1)
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
  }

  @Post("/sign-in")
  signInWithPassword(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signInWithPassword(authCredentialsDto);
  }
}
