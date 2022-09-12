import { RegisterOptions } from "../../../../domain/auth/service/options/register.options";

export class RegisterDto implements RegisterOptions {
  email: string;
  username: string;
  password: string;
}
