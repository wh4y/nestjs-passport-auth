import { User } from "../../../user/entity/user.entity";
import { LoginOptions } from "../options/login.options";

export interface IAuthService {
  login(options: LoginOptions): Promise<User>;

  register(options): Promise<User>;

  validatePassword(passwordToCompare: string, hashedPassword: string): Promise<boolean>;
}
