import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { typeOrmConfig } from "./config/typeorm.config";
import { AuthModule } from "./modules/auth/auth.module";
import { CaptchaModule } from "./modules/captcha/captcha.module";
import { FilesModule } from "./modules/files/files.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    FilesModule,
    AuthModule,
    CaptchaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
