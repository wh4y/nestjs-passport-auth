import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { IAuthController } from "./interface/auth-controller.interface";
import { UserResponse } from "./response/user.response";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "../../../domain/auth/service/auth.service";
import { AuthedUser } from "../decorator/authed-user.decorator";
import { AuthGuard } from "@nestjs/passport";
import { TokenInterceptor } from "../interceptor/token.interceptor";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/auth")
export class AuthController implements IAuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @UseGuards(AuthGuard("local"))
  @UseInterceptors(TokenInterceptor)
  @Post("/login")
  async login(@AuthedUser() user: UserResponse): Promise<UserResponse> {
    return user;
  }

  @UseInterceptors(TokenInterceptor)
  @Post("/register")
  async register(@Body() dto: RegisterDto): Promise<UserResponse> {
    return await this.authService.register(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/test')
  async test() {
    return "success!";
  }
}


