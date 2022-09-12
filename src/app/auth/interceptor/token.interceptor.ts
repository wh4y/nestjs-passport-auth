import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { TokenService } from "../service/token.service";
import { User } from "../../../domain/user/entity/user.entity";
import { from, map, Observable } from "rxjs";
import { Response } from "express";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>
  ): Observable<User> {
    return next.handle().pipe(
      map(user => {
        const response = context.switchToHttp().getResponse<Response>();
        const token = this.tokenService.generateToken({
          email: user.email,
          username: user.username
        });

        response.setHeader("Authorization", `Bearer ${token}`);
        response.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict"
        });

        return user;
      })
    );
  }
}
