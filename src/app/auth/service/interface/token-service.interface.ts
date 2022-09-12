import { JwtPayload } from "./jwt-payload.interface";
import { User } from "../../../../domain/user/entity/user.entity";

export interface ITokenService {
  generateToken(payload: JwtPayload): string;

  verifyPayload(payload: JwtPayload): Promise<User>;
}
