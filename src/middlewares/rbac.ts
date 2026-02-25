import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

export function requireRole(...roles: Array<"author" | "reader">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, "Unauthorized", ["Missing token"]));
    if (!roles.includes(req.user.role as any)) return next(new HttpError(403, "Forbidden", ["Forbidden"]));
    next();
  };
}