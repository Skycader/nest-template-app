import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { UserRepository } from '../repositories/user.repository';
import { JwtPayloadInterface } from '../models/jwt-payload.model';
import { UserSearchConfigInterface } from '../models/user-search.config';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';
import { StatusCodeEnum } from '../models/status.enum';
import { PasswordResetDto } from '../dtos/password-reset.dto';
import { UserRolesEnum } from '../models/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {
    this.initAuthTable();
  }

  async initAuthTable(): Promise<number> {
    let admin = await this.getUser('admin');

    if (admin) return 0;

    this.signUp({
      username: 'admin',
      password: 'admin',
    });

    return 1;
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<StatusCodeEnum> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async changePassword(
    username: string,
    password: PasswordResetDto,
  ): Promise<StatusCodeEnum> {
    return this.userRepository.changePassword(username, password);
  }

  async searchUsers(config: UserSearchConfigInterface = {}) {
    return this.userRepository.searchUsers(config);
  }

  async getUser(username: string = ''): Promise<UserEntity> {
    return this.userRepository.getUser(username);
  }

  async updateRole(username: string, role: UserRolesEnum): Promise<UserEntity> {
    return this.userRepository.updateRole(username, role);
  }

  async signInWithPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ user: UserEntity; accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayloadInterface = { username };
    const accessToken = await this.jwtService.signAsync(payload);

    const user = await this.getUser(username);

    return { user, accessToken };
  }

  async editProfile(username: string, userDto: UserDto) {
    return this.userRepository.editProfile(username, userDto);
  }
}
