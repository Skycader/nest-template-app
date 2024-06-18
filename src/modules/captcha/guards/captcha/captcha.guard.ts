import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CaptchaService } from './../../services/captcha/captcha.service';

@Injectable()
export class CaptchaGuard implements CanActivate {
  // captchaService = new CaptchaService();
  constructor(private captchaService: CaptchaService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.captchaService.verifyCaptcha(request.headers.captcha);
  }
}
