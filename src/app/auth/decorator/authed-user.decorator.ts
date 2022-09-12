import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { User } from "../../../domain/user/entity/user.entity";

export const AuthedUser = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user as User;

    return user;
  }
);
