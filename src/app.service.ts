import { Injectable } from "@nestjs/common";

class SystemOnline {
  status = 200;
  message = "[Service] Online";
}

@Injectable()
export class AppService {
  getHello(): any {
    return new SystemOnline();
  }
}
