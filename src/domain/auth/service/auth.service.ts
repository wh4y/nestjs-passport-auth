import { Injectable } from "@nestjs/common";
import { IAuthService } from "./interface/auth-service.interface";
import { User } from "../../user/entity/user.entity";
import { UserService } from "../../user/service/user.service";
import { LoginOptions } from "./options/login.options";
import * as bcrypt from "bcrypt";
import { RegisterOptions } from "./options/register.options";
import { CreateUserOptions } from "../../user/entity/options/create-user.options";


@Injectable()
export class AuthService implements IAuthService {

  constructor(
    private readonly userService: UserService
  ) {
  }


  async login(options: LoginOptions): Promise<User> {
    const user = await this.userService.findByEmail(options.email);
    if (!user) throw new Error("Invalid response!");

    const isPasswordValid = await this.validatePassword(options.password, user.password);
    if (!isPasswordValid) throw new Error("Invalid response!");

    return user;
  }

  async register(options: RegisterOptions): Promise<User> {
    const user = await this.userService.create(options as CreateUserOptions);

    return user;
  }

  async validatePassword(passwordToCompare: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(passwordToCompare, hashedPassword);
  }
}
