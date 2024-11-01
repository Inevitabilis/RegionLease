import { Express, NextFunction } from "express";
import { JwtPayload, verify, VerifyCallback } from "jsonwebtoken";
import config from "../config.json";

export function authMiddleware(req: any, res: any, next: NextFunction): void {
  const inputToken: string = req.get("authorization");
  const token = inputToken.split(" ")[1];
  console.log(token);
  if (!token) {
    req.user = undefined;
    next();
  } else {
    verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      req.user = decoded;
      next();
      return;
    });
  }
}
