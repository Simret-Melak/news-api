import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { fail } from "../utils/response";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
 
  if (err instanceof HttpError) {
    return res.status(err.status).json(fail(err.message, err.errors));
  }

  
  if (err?.name === "ZodError") {
    const issues = err.issues?.map((i: any) => i.message) ?? ["Validation error"];
    return res.status(400).json(fail("Validation error", issues));
  }


  console.error(err);
  return res.status(500).json(fail("Internal server error", ["Something went wrong"]));
}