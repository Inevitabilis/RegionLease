import "reflect-metadata";
import express, { json } from "express";
import { AppDataSource } from "./datasource";
import { Region } from "./entities/region";
import { Route } from "./webpageRouting";

//HOW TO EXTEND DATABASE:
//make a new entity
//add it to AllDBClasses.ts

async function main() {
  const dataSource = await AppDataSource();

  const regionRepo = dataSource.getRepository(Region);
  const regions = await regionRepo.find();

  console.log(JSON.stringify(regions));

  const app = express();
  app.use(json());
  Route(app, dataSource);

  const port = 3000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
void main();


function shutdown(signal: NodeJS.Signals) {
  console.log(`got shutdown signal (${signal}), shutting down...`);
  AppDataSource().then((x) => x.destroy());
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
