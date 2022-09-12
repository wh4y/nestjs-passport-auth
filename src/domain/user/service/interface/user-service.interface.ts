import { User } from "../../entity/user.entity";
import { FindUserOptions } from "../options/find-user.options";
import { UpdateUserOptions } from "../options/update-user.options";
import { CreateUserOptions } from "../../entity/options/create-user.options";

export interface IUserService {
  create(options: CreateUserOptions): Promise<User>;

  edit(user: User, options: UpdateUserOptions): Promise<User>;

  delete(id: string): Promise<void>;

  findByEmail(email: string): Promise<User>;

  findById(id: string): Promise<User>;

  findBy(options: FindUserOptions): Promise<User | User[]>;
}
