import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import { dashboard } from "./author.controller";

export const authorRouter = Router();

authorRouter.get("/dashboard", requireAuth, requireRole("author"), dashboard);