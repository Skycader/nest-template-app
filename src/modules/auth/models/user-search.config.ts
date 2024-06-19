import { FindOperator } from "typeorm";
import { UserRolesEnum } from "./roles.enum";

export interface UserSearchConfigInterface {
  id?: number | FindOperator<number>;
  username?: string | FindOperator<string>;
  role?: UserRolesEnum | FindOperator<UserRolesEnum>;
  name?: string | FindOperator<string>;
  surname?: string | FindOperator<string>;
  midname?: string | FindOperator<string>;
  birthdate?: number | FindOperator<number>;
  telephone?: string | FindOperator<string>;
  information?: string | FindOperator<string>;
}
