import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { AuthCredentialsDto } from '../../dtos/auth-credentials.dto';
import { StatusCodeEnum } from '../../models/status.enum';
import { AuthGuard } from '@nestjs/passport';
import { IsAdminGuard } from '../../guards/is-admin.guard';

@Controller('auth')
export class AuthPostController {
  constructor(private authService: AuthService) { }

  @Post('/sign-up')
  @UseGuards(AuthGuard(), IsAdminGuard)
  async signUp(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto,
  ) {
    const status = await this.authService.signUp(authCredentialsDto);
    if (status === StatusCodeEnum.Failure)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
  }

  @Post('/sign-in')
  signInWithPassword(
    @Body(ValidationPipe)
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signInWithPassword(authCredentialsDto);
  }
}
