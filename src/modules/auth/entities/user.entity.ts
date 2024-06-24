import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRolesEnum } from '../models/roles.enum';
import { UserInterface } from '../models/user.model';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Users' })
@Unique(['username'])
export class UserEntity extends BaseEntity implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ default: 1 })
  role: UserRolesEnum;

  @ApiProperty()
  @Column({ default: '' })
  name: string;

  @ApiProperty()
  @Column({ default: '' })
  surname: string;

  @ApiProperty()
  @Column({ default: '' })
  midname: string;

  @ApiProperty()
  @Column({ default: 0 })
  birthdate: number; /* unix timestamp */

  @ApiProperty()
  @Column({ default: '' })
  telephone: string;

  /**
   * Additional info
   * Type: JSON
   */
  @ApiProperty()
  @Column({ default: '' })
  information: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
