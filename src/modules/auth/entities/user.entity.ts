import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["username"])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string; /* username */

  @Column()
  role: string; /* admin, moderator, etc. */

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  midname: string;

  @Column()
  birthdate: number; /* unix timestamp */

  @Column()
  telephone: string;

  @Column()
  information: string; /* Any additional info */

  @Column()
  password: string;

  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
