import { Express } from "express";
import { dbClassesMap } from "./AllDBClasses";
import { DataSource } from "typeorm";
import { User } from "./entities/user";
import { createHash } from "crypto";
import config from "../config.json";
import { JwtPayload, sign } from "jsonwebtoken";
import { authMiddleware } from "./middleware";
import {
  hasVisibilitySettings,
  IHaveVisibilitySettings,
} from "./entities/IHaveVisibilitySettings";

export function Route(app: Express, datasource: DataSource): void {
  app.post("/api/login", async (req, res) => {
    const [Login, password] = [req.body.login, req.body.password];
    const loginResponse = await login(datasource, Login, password);
    if (loginResponse.status == "ok") {
      res.status(200).json(loginResponse.data);
    } else {
      const err = loginResponse.data as loginError;
      res.status(err.code).send(err.message);
    }
  });

  app.post("/api/register", async (req, res): Promise<void> => {
    const [Login, password, contacts] = [
      req.body.login,
      req.body.password,
      req.body.contacts,
    ];
    if (Login == undefined || password == undefined || contacts == undefined) {
      res.status(400).send("login or password or contacts were undefined");
      return;
    }
    const userRepo = datasource.getRepository(User);
    const amountOfUsersWithThatLogin = await userRepo
      .find({
        where: {
          name: Login,
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
    user.name = Login;
    user.passwordSaltedHash = createHash("sha256")
      .update(password + Login)
      .digest("base64");
    user.contacts = contacts;
    await userRepo.insert(user);

    const loginResponse = await login(datasource, Login, password);
    if (loginResponse.status == "ok") {
      res.status(200).json(loginResponse.data);
    } else {
      const err = loginResponse.data as loginError;
      res.status(err.code).send(err.message);
    }
  });

  app.get("/api/database/:typerequest", authMiddleware, async (req, res) => {
    if (req.params.typerequest in dbClassesMap) {
      const classname = req.params.typerequest as keyof typeof dbClassesMap;
      const requestedClass = dbClassesMap[classname];
      const requestedRepo = datasource.getRepository(requestedClass);
      let requestedObjects = await requestedRepo.find();

      requestedObjects = requestedObjects.filter((x) => {
        let result = true;
        if (hasVisibilitySettings(x)) {
          result = Boolean(x.isVisible());
          if ("user" in req) {
            const inspectedUser = req.user as JwtPayload;
            const allowedUsers: User[] = x.allowedUsers();
            if (
              inspectedUser != undefined &&
              allowedUsers != undefined &&
              allowedUsers.some((x) => x.name == inspectedUser.username)
            )
              result = true;
          }
        }
        return result;
      });

      res.status(200).send(JSON.stringify(requestedObjects));
    } else
      res
        .status(404)
        .send(`couldn't find type ${req.params.typerequest} in database`);
  });
}

type loginResponse = {
  status: "ok" | "error";
  data: string | loginError;
};
type loginError = {
  code: number;
  message: string;
};

async function login(
  cursor: DataSource,
  login: string,
  password: string
): Promise<loginResponse> {
  const userRepo = cursor.getRepository(User);
  const user = await userRepo.findOneBy({
    name: login,
  });
  if (user == null) {
    const loginerror: loginError = {
      code: 404,
      message: `couldn't find user matching provided login ( ${login} )`,
    };
    return { status: "error", data: loginerror };
  }
  if (
    user.passwordSaltedHash !=
    createHash("sha256")
      .update(password + login)
      .digest("base64")
  ) {
    const loginerror: loginError = {
      code: 404,
      message: `incorrect password ( ${password} )`,
    };
    return { status: "error", data: loginerror };
  }
  const payload = { username: user.name };
  const key = config.secret;
  const options = { expiresIn: "1h" };
  const token = sign(payload, key, options);
  return { status: "ok", data: token };
}
