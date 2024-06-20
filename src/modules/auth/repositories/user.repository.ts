import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { FindOptionsWhere, Like, Repository, TypeORMError } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { AuthCredentialsDto } from "../dtos/auth-credentials.dto";
import { UserSearchConfigInterface } from "../models/user-search.config";
import { QueryErrorInterface } from "../models/query-fail.model";
import { UserRolesEnum } from "../models/roles.enum";
import { UserDto } from "../dtos/user.dto";
import { PublicUserFields } from "../models/user.fields";

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

    if (user.username === "admin") user.role = UserRolesEnum.administrator;

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

  async searchUsers(config: UserSearchConfigInterface = {}) {
    const page = config.page ? config.page : 1;
    const searchConfig: FindOptionsWhere<UserEntity> = { username: Like("%%") };

    if (config.username) searchConfig.username = Like(`%${config.username}%`);
    if (config.role) searchConfig.role = config.role;
    if (config.name) searchConfig.name = Like(`%${config.name}%`);
    if (config.surname) searchConfig.surname = Like(`%${config.surname}%`);
    if (config.midname) searchConfig.midname = Like(`%${config.midname}%`);
    if (config.telephone) searchConfig.username = Like(`%${config.telephone}%`);

    let pages = await this.count({
      where: [searchConfig],
    });

    const users = await this.find({
      select: PublicUserFields,
      where: [searchConfig],
      take: 10,
      skip: page * 10 - 10,
    });

    return {
      users,
      pages,
    };
  }

  async editProfile(username: string, profile: UserDto) {
    let user = await this.findOne({
      select: PublicUserFields,
      where: { username: username },
    });

    user.name = profile?.name ? profile.name : user.name;
    user.midname = profile?.midname ? profile.midname : user.midname;
    user.surname = profile?.surname ? profile.surname : user.surname;
    user.birthdate = profile?.birthdate ? profile.birthdate : user.birthdate;
    user.telephone = profile?.telephone ? profile.telephone : user.telephone;
    user.information = profile?.information
      ? profile.information
      : user.information;

    await user.save();
    return user;
  }

  public errorHandler(error: QueryErrorInterface) {
    switch (error.code) {
      case 23505:
      // throw new ConflictException("Username already exists");
      default:
      // throw new InternalServerErrorException();
    }
  }
}
