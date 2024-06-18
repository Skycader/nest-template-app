import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CaptchaService } from '../../services/captcha/captcha.service';
import { CaptchaGuard } from './../../guards/captcha/captcha.guard';

@Controller('captcha')
export class CaptchaController {
  constructor(
    private captchaService: CaptchaService,
    private jwtService: JwtService,
  ) {}

  @Get()
  getCaptcha() {
    return this.captchaService.getCaptcha();
  }

  @Post()
  verifyCaptcha(@Body('token') token: string) {
    return this.captchaService.verifyCaptcha(token);
  }

  @Post('/test')
  @UseGuards(CaptchaGuard)
  testCaptcaGuard() {}
  @Post('token')
  async verifyToken(@Body('token') token: string) {
    try {
      let result = await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
