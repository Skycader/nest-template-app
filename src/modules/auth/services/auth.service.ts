import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthCredentialsDto } from "../dtos/auth-credentials.dto";
import { UserRepository } from "../repositories/user.repository";
import { JwtPayloadInterface } from "../models/jwt-payload.model";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) { }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async findUser(username: string, page: number, config: any = {}) {
    return this.userRepository.findUser(username, page, config);
  }

  async signIn(authCredentialsDto: any) {
    if (!authCredentialsDto.username) {
      throw new UnauthorizedException("Invalid credentials");
    }

    let user = await this.findUser(authCredentialsDto.username, 1);
    if (!user[0]) {
      let usr = {
        username: authCredentialsDto.username,
        password: "hardpassword",
      };
      this.signUp(usr);
    }

    let obj = { username: authCredentialsDto.username };

    const payload: JwtPayloadInterface = obj;
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async signInWithPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto
    );
    if (!username) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayloadInterface = { username };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async editProfile(username: string, profileDataDto: any) {
    return this.userRepository.editProfile(username, profileDataDto);
  }

  async editProfileByModerator(username: string, profileDataDto: any) {
    return this.userRepository.editProfileByModerator(username, profileDataDto);
  }
}
