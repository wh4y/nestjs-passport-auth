import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../../../domain/auth/service/auth.service";
import { User } from "../../../domain/user/entity/user.entity";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
      passReqToCallback: false
    });
  }

  validate(email: string, password: string): Promise<User> {
    return this.authService.login({ email, password });
  }
}
