import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";
import { User } from "../custom";
import { verify } from "jsonwebtoken";

async function VerifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new Error("Unauthorized");

    const user = verify(token, JWT_SECRET as string);

    if (!user) throw new Error("Unauthorized");

    req.user = user as User;

    next();
  } catch (err) {
    next(err);
  }
}

async function AdminGuard(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.user?.role);
    if (String(req.user?.role) !== "1") throw new Error("Not an Admin");

    next();
  } catch (err) {
    next(err);
  }
}

export { VerifyToken, AdminGuard };