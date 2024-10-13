import { DataSource } from "typeorm";
import { dbClassesMap } from "./AllDBClasses";
import fs from "fs";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: fs.readFileSync("D:\\dbpwd.txt", "utf8").trim(),
  database: "regionlease",
  synchronize: true,
  logging: false,
  entities: Object.values(dbClassesMap),
  subscribers: [],
  migrations: [],
});
