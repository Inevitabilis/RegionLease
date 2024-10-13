import { Express } from "express";
import { dbClassesMap } from "./AllDBClasses";
import { DataSource } from "typeorm";

export function Route(app: Express, datasource: DataSource): void {
  app.get("/api/:typerequest", async (req, res) => {
    if (req.params.typerequest in dbClassesMap) {
      const classname = req.params.typerequest as keyof typeof dbClassesMap;
      const requestedRepo = datasource.getRepository(dbClassesMap[classname]);
      let requestedObjects = await requestedRepo.find();

      if ("isVisible" in requestedObjects[0]) {
        requestedObjects = requestedObjects.filter((x) => x.isVisible);
      }
      res.send(JSON.stringify(requestedObjects));
    } else res.send(`couldn't find type ${req.params.typerequest} in database`);
  });
}
