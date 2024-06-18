import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: "./database/db.sql",
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  logging: false,
  // entities: ['src/entity/*.ts', './build/src/entity/*.js'], // <- Here!
  // entities: [Todo],
  migrations: [__dirname + "/migrations"],
  synchronize: true,
};
