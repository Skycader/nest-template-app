import { UserRolesEnum } from "./roles.enum";

export interface UserInterface {
  id: number;
  username: string;
  role: UserRolesEnum;
  name: string;
  surname: string;
  midname: string;
  birthdate: number;
  telephone: string;
  information: string;
  password: string;
  salt: string;
}
