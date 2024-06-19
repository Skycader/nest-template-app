import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Like, Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { AuthCredentialsDto } from "../dtos/auth-credentials.dto";
import { UserSearchConfigInterface } from "../models/user-search.config";
@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  public async getUser(username: string): Promise<string> {
    const user = await this.findOne({
      where: { username },
    });

    if (user) return user.username;
    throw new NotFoundException(404);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<number> {
    const { username, password } = authCredentialsDto;

    const user = new UserEntity();

    user.username = username.toLowerCase();
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      return 0;
    } catch (e) {
      this.errorHandler(e);
      return 1;
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({
      where: { username },
    });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async findUser(
    username: string = "",
    page: number = 1,
    config: UserSearchConfigInterface = {}
  ) {
    const searchConfig: UserSearchConfigInterface = {
      username: Like(`%${config.username}%`),
    };

    if (config.name) searchConfig.name = Like(`%${config.name}%`);
    if (config.surname) searchConfig.surname = Like(`%${config.surname}%`);
    if (config.midname) searchConfig.midname = Like(`%${config.midname}%`);
    if (config.telephone) searchConfig.username = Like(`%${config.telephone}%`);

    let count = await this.count({
      where: [searchConfig],
    });

    let res = await this.find({
      where: [searchConfig],
      take: 10,
      skip: page * 10 - 10,
    });

    return {
      users: res,
      length: count,
    };
  }

  async editProfile(username: string, profileDataDto: any) {
    let user = await this.findOne({
      where: { username: username },
    });

    console.log(profileDataDto);
    const profile = profileDataDto;
    user.name = profile.firstname?.slice(0, 500);
    user.midname = profile.midname?.slice(0, 500);
    user.surname = profile.surname?.slice(0, 500);
    user.birthdate = profile.birthday?.slice(0, 500); /*unix*/
    user.telephone = profile.telephone?.slice(0, 500);
    user.information = profile.information?.slice(0, 5000);
    await user.save();
  }

  async editProfileByModerator(username: string, profileDataDto: any) {
    let user = await this.findOne({
      where: { username: username },
    });

    const profile = profileDataDto;
    user.name = profile.firstname?.slice(0, 500);
    user.midname = profile.midname?.slice(0, 500);
    user.surname = profile.surname?.slice(0, 500);
    user.birthdate = profile.birthday?.slice(0, 500); /*unix*/
    user.telephone = profile.telephone?.slice(0, 500);
    user.information = profile.information?.slice(0, 5000);

    await user.save();
  }

  public errorHandler(error: any) {
    switch (error.code) {
      case "23505":
        // throw new ConflictException('Username already exists');
        console.log("user exists");
      default:
        // throw new InternalServerErrorException();
        console.log("some other error", error);
    }
  }
}
