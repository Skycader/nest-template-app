import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { secret } from 'src/config/jwt.config';
import { CaptchaController } from './controllers/captcha/captcha.controller';
import { CaptchaGuard } from './guards/captcha/captcha.guard';
import { CaptchaService } from './services/captcha/captcha.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: secret,
      signOptions: {
        expiresIn: 31104000, //1 year
      },
    }),
  ],
  providers: [CaptchaService, CaptchaGuard],
  controllers: [CaptchaController],
  exports: [CaptchaService],
})
export class CaptchaModule {}
