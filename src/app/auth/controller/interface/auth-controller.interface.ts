import { RegisterDto } from "../dto/register.dto";
import { UserResponse } from "../response/user.response";

export interface IAuthController {
  login(user: UserResponse): Promise<UserResponse>;

  register(dto: RegisterDto): Promise<UserResponse>;
}
