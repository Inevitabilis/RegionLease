import { DataSource } from "typeorm";
import { dbClassesMap } from "./AllDBClasses";
import config from "../config.json";

export async function AppDataSource(): Promise<DataSource> {
  return (dataSource ??= await initDataSource());
}
let dataSource: DataSource | undefined = undefined;

async function initDataSource(): Promise<DataSource> {
  const e = new DataSource({
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: "regionlease",
    synchronize: true,
    logging: false,
    entities:
      // [`./entites/*.{js, ts}`],
      Object.values(dbClassesMap),
    subscribers: [],
    migrations: [],
  });
  return await e.initialize();
}
