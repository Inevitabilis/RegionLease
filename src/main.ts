import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./datasource";
import { Region } from "./entities/region";
import { Route } from "./webpageRouting";

async function main() {
  await AppDataSource.initialize();

  const regionRepo = AppDataSource.getRepository(Region);
  const regions = await regionRepo.find();
  console.log(JSON.stringify(regions));

  const app = express();
  Route(app, AppDataSource);

  const port = 3000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
void main();

function shutdown(signal: NodeJS.Signals) {
  console.log(`got shutdown signal (${signal}), shutting down...`);
  AppDataSource.destroy();
  process.exit(0);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
