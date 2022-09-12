import { DynamicModule, Module } from "@nestjs/common";
import { UserService } from "../../domain/user/service/user.service";
import { AuthService } from "../../domain/auth/service/auth.service";
import { TokenService } from "./service/token.service";
import { AuthController } from "./controller/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../domain/user/entity/user.entity";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        return {
          secret: configService.get<string>("JWT_SECRET")
        };
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    UserService,
    AuthService,
    TokenService,
    LocalStrategy,
    JwtStrategy
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {
}
