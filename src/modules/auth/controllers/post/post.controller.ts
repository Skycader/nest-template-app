import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "../../services/auth.service";
import { AuthCredentialsDto } from "../../dtos/auth-credentials.dto";

@Controller("auth")
export class AuthPostController {
  constructor(private authService: AuthService) {
    this.signUp({
      username: "admin",
      password: "admin",
    });
  }

  @Post("/sign-up")
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
}
