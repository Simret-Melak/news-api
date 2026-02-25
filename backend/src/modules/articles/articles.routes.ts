import { Router } from "express";
import { requireAuth, optionalAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import { validateBody } from "../../middlewares/validate";
import { createArticleSchema, updateArticleSchema } from "./articles.schema";
import { createArticle, listMyArticles, updateArticle, deleteArticle } from "./articles.controller";
import { publicFeed } from "./public.controller";
import { readArticle } from "./read.controller";

export const articlesRouter = Router();

articlesRouter.get("/", publicFeed);

articlesRouter.post("/", requireAuth, requireRole("author"), validateBody(createArticleSchema), createArticle);
articlesRouter.get("/me", requireAuth, requireRole("author"), listMyArticles);
articlesRouter.put("/:id", requireAuth, requireRole("author"), validateBody(updateArticleSchema), updateArticle);
articlesRouter.delete("/:id", requireAuth, requireRole("author"), deleteArticle);

articlesRouter.get("/:id", optionalAuth, readArticle);