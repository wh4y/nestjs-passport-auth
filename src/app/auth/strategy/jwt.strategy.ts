import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../service/interface/jwt-payload.interface";
import { User } from "../../../domain/user/entity/user.entity";
import { TokenService } from "../service/token.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("JWT_SECRET"),
      ignoreExpiration: false,
      passReqToCallback: false
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.tokenService.verifyPayload(payload);
  }
}
