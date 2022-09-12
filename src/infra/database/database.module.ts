import { DynamicModule, Global, Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({})
export class DatabaseModule {
  static async registerAsync(): Promise<DynamicModule> {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async (configService: ConfigService) => {
            return {
              type: configService.get<string>("DB_DIALECT"),
              host: configService.get<string>("DB_HOST"),
              port: configService.get<string>("DB_PORT"),
              username: configService.get<string>("DB_USER"),
              password: configService.get<string>("DB_PASSWORD"),
              database: configService.get<string>("DB_NAME"),
              entities: [__dirname + "/../../domain/**/*.entity{.ts,.js}"],
              synchronize: true,
              logging: true
            } as TypeOrmModuleAsyncOptions;
          },
          inject: [ConfigService]
        })
      ],
      exports: [TypeOrmModule]
    };
  }
}
