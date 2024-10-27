import { DataSource } from "typeorm";
import { dbClassesMap } from "./AllDBClasses";
import config from "../config.json";
import fs from "fs";

export function AppDataSource(): DataSource {
  return (dataSource ??= initDataSource());
}
let dataSource: DataSource | undefined = undefined;

function initDataSource(): DataSource {
  return new DataSource({
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: "regionlease",
    synchronize: true,
    logging: false,
    entities: Object.values(dbClassesMap),
    subscribers: [],
    migrations: [],
  });
}
