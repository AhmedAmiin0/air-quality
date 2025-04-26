import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import databaseConfig from "./database.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: "mysql",
          host: configService.get("database.host", 'localhost'),
          port: configService.get("database.port", 3306),
          username: configService.get("database.username", 'root'),
          password: configService.get("database.password", ''),
          database: configService.get("database.name", 'airquality'),
          entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
          options: {
            trustServerCertificate: true,
          },
          logging: true,
          synchronize: true,
          // migrations: [join(__dirname, "/migrations/**/*{.ts,.js}")],
          // migrationsTableName: "typeorm_migrations",
          // migrationsRun: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }
