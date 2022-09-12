import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: configService.get<string>("DB_DIALECT"),
  host: "localhost",
  port: configService.get<string>("DB_PORT"),
  username: configService.get<string>("DB_USER"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_NAME"),
  synchronize: true,
  logging: true,
  entities: ["./dist/domain/**/*.entity{.ts,.js}"],
  migrations: ["./dist/infra/database/typeorm/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "./dist/infra/database/typeorm/migrations"
  }
} as DataSourceOptions);
