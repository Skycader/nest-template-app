import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { secret } from "src/config/jwt.config";
import { UserEntity } from "./entities/user.entity";
import { AuthService } from "./services/auth.service";
import { UserRepository } from "./repositories/user.repository";
import { JwtStrategy } from "./services/jwt.strategy";
import { AuthGetController } from "./controllers/get/get.controller";
import { AuthPostController } from "./controllers/post/post.controller";
import { AuthPatchController } from "./controllers/patch/patch.controller";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({
      secret: secret,
      signOptions: {
        expiresIn: 31104000, //1 year
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthGetController, AuthPostController, AuthPatchController],
  providers: [AuthService, UserRepository, JwtStrategy],
  exports: [AuthService, UserRepository, JwtStrategy, PassportModule],
})
export class AuthModule {}
