import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as Captcha from 'node-captcha-generator';
@Injectable()
export class CaptchaService {
  getCaptcha(): any {
    const c = new Captcha({
      length: 4, // number length
      size: {
        // output size
        width: 100,
        height: 50,
      },
    });

    // get base64 image as string
    let time = Date.now() + 300000; //5 minutes
    let info = {};
    c.toBase64(function(err, base64) {
      info = {
        //value: c.value + '.' + time + '.',
        expiresIn: time,
        hashed: btoa(
          bcrypt.hashSync(c.value + time + 'secret', bcrypt.genSaltSync()),
        ),
        base: base64,
      };
    });

    return info;
  }

  async verifyCaptcha(token: string) {
    try {
      const data = token.split('.');
      let code = data[0];
      let expiresIn = Number(data[1]);
      let hashed = data[2];
      if (Number(expiresIn) < Date.now()) return false;

      return await bcrypt.compare(code + expiresIn + 'secret', atob(hashed));
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
