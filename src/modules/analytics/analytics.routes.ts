import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import { runAnalytics } from "./analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.post("/run", requireAuth, requireRole("author"), runAnalytics);