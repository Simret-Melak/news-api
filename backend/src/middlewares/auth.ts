import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../utils/httpError";

type JwtPayload = {
  sub: string;
  role: "author" | "reader";
};

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized", ["Missing token"]));
  }

  const token = header.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.sub, role: decoded.role as any };
    next();
  } catch {
    next(new HttpError(401, "Unauthorized", ["Invalid or expired token"]));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  const token = header.slice("Bearer ".length);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.sub, role: decoded.role as any };
  } catch {
 
  }
  next();
}