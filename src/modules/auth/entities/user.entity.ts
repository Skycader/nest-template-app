import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { RolesEnum } from "../models/roles.enum";

@Entity()
@Unique(["username"])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: 0 })
  role: RolesEnum;

  @Column({ default: "" })
  name: string;

  @Column({ default: "" })
  surname: string;

  @Column({ default: "" })
  midname: string;

  @Column({ default: 0 })
  birthdate: number; /* unix timestamp */

  @Column({ default: "" })
  telephone: string;

  /**
   * Additional info
   * Type: JSON
   */
  @Column({ default: "" })
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
