import { ITokenService } from "./interface/token-service.interface";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./interface/jwt-payload.interface";
import { User } from "../../../domain/user/entity/user.entity";
import { UserService } from "../../../domain/user/service/user.service";

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jWTService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
  }

  generateToken(payload: JwtPayload): string {
    const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN");
    const token = this.jWTService.sign(payload, { expiresIn });

    return token;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    console.log(payload);
    const user = await this.userService.findByEmail(payload.email);
    return user;
  }
}
