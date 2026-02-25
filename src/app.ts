import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error";
import { authRouter } from "./modules/auth/auth.routes";
import { articlesRouter } from "./modules/articles/articles.routes";
import { analyticsRouter } from "./modules/analytics/analytics.routes";
import { authorRouter } from "./modules/author/author.routes";

export const app = express();

/**
 * Core middleware
 */
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

/**
 * Routers
 */
app.use("/auth", authRouter);
app.use("/articles", articlesRouter);
app.use("/analytics", analyticsRouter);
app.use("/author", authorRouter);

/**
 * 404 handler
 */
app.use((_req, res) => {
  res.status(404).json({
    Success: false,
    Message: "Not Found",
    Object: null,
    Errors: ["Route not found"],
  });
});

/**
 * Global error handler
 */
app.use(errorHandler);