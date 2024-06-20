import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import * as Captcha from "node-captcha-generator";
import { secret } from "src/config/jwt.config";
@Injectable()
export class CaptchaService {
  getCaptcha() {
    const captcha: Captcha = new Captcha({
      length: 4, // number length
      size: {
        // output size
        width: 100,
        height: 50,
      },
    });

    // get base64 image as string
    let duration = Date.now() + 300000; //5 minutes
    let info = {};

    captcha.toBase64(function(err: Error, base64: string) {
      info = {
        //value: c.value + '.' + time + '.',
        expiresIn: duration,
        hashed: btoa(
          bcrypt.hashSync(
            captcha.value + duration + secret,
            bcrypt.genSaltSync()
          )
        ),
        base: base64,
      };
    });

    return info;
  }

  async verifyCaptcha(token: string): Promise<boolean> {
    try {
      const data = token.split(".");
      let code = data[0];
      let expiresIn = Number(data[1]);
      let hashed = data[2];
      if (Number(expiresIn) < Date.now()) return false;
      return await bcrypt.compare(code + expiresIn + secret, atob(hashed));
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
