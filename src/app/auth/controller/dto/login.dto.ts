import { LoginOptions } from "../../../../domain/auth/service/options/login.options";

export class LoginDto implements LoginOptions {
  email: string;
  password: string;
}
