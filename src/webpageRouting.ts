import { Express } from "express";
import { dbClassesMap } from "./AllDBClasses";
import { DataSource } from "typeorm";
import { User } from "./entities/user";
import { createHash } from "crypto";
import config from "../config.json";

const jwt = require("jsonwebtoken");
export function Route(app: Express, datasource: DataSource): void {
  app.get("/api/:typerequest", async (req, res) => {
    if (req.params.typerequest in dbClassesMap) {
      const classname = req.params.typerequest as keyof typeof dbClassesMap;
      const requestedClass = dbClassesMap[classname];
      const requestedRepo = datasource.getRepository(requestedClass);
      let requestedObjects = await requestedRepo.find();

      if ("isVisible" in requestedClass) {
        requestedObjects = requestedObjects.filter((x) => x.isVisible);
      }
      res.status(200).send(JSON.stringify(requestedObjects));
    } else
      res
        .status(404)
        .send(`couldn't find type ${req.params.typerequest} in database`);
  });

  app.get("/api/register ", async (req, res) => {
    const { login, password } = req.body;
    if (login == undefined || password == undefined) {
      res.status(400).send("login or password were undefined");
      return;
    }
    const userRepo = datasource.getRepository(User);
    const amountOfUsersWithThatLogin = await userRepo
      .find({
        where: {
          name: login,
        },
      })
      .then((users) => users.length);
    if (amountOfUsersWithThatLogin > 0) {
      res
        .status(409)
        .send(
          "the login that is attempted to be registered already exists in database"
        );
      return;
    }

    const user: User = new User();
    user.name = login;
    user.passwordSaltedHash = createHash("sha256")
      .update(password + login)
      .digest("base64");
    userRepo.insert(user);

    const payload = { username: user.name };
    const key = config.secret;
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, key, options);

    res.status(200).json({ token }).send("user successfully registered!");
  });
}
