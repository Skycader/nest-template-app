import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthCredentialsDto } from "../dtos/auth-credentials.dto";
import { UserRepository } from "../repositories/user.repository";
import { JwtPayloadInterface } from "../models/jwt-payload.model";
import { UserSearchConfigInterface } from "../models/user-search.config";
import { UserInterface } from "../models/user.model";
import { Observable, of } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {
    this.initAuthTable();
  }

  async initAuthTable() {
    let admin = await this.getUser("admin");

    if (admin) return of(0);

    this.signUp({
      username: "admin",
      password: "admin",
    });

    return of(1);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<number> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async searchUsers(config: UserSearchConfigInterface = {}) {
    return this.userRepository.searchUsers(config);
  }

  async getUser(username: string = "") {
    return this.userRepository.getUser(username);
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

  async editProfile(username: string, profileDataDto: UserInterface) {
    return this.userRepository.editProfile(username, profileDataDto);
  }

  async editProfileByModerator(
    username: string,
    profileDataDto: UserInterface
  ) {
    return this.userRepository.editProfileByModerator(username, profileDataDto);
  }
}
