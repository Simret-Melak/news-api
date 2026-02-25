import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { ok, fail } from "../../utils/response";
import type { CreateArticleInput, UpdateArticleInput } from "./articles.schema";

function requireUser(req: Request) {
  if (!req.user) throw new Error("Auth middleware missing");
  return req.user;
}

export async function createArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const body = req.body as CreateArticleInput;

    const article = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
        category: body.category,
        status: body.status ?? "Draft",
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(201).json(ok("Article created", article));
  } catch (e) {
    next(e);
  }
}

export async function listMyArticles(req: Request, res: Response, next: NextFunction) {
  try {
    const authorId = req.user!.id;

    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(String(req.query.size ?? "10"), 10) || 10, 1), 100);
    const skip = (page - 1) * size;

    const includeDeleted = String(req.query.includeDeleted ?? "false") === "true";

    const where = {
      authorId,
      ...(includeDeleted ? {} : { deletedAt: null }),
    } as const;

    const [total, items] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: size,
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          createdAt: true,
          deletedAt: true,
        },
      }),
    ]);

    return res.json({
      Success: true,
      Message: "My articles",
      Object: items.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        status: a.deletedAt ? "Deleted" : a.status, // mark deleted
        createdAt: a.createdAt,
        deletedAt: a.deletedAt,
      })),
      PageNumber: page,
      PageSize: size,
      TotalSize: total,
      Errors: null,
    });
  } catch (e) {
    next(e);
  }
}

export async function updateArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const body = req.body as UpdateArticleInput;

    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true, deletedAt: true },
    });

    if (!article || article.deletedAt) {
      return res.status(404).json(fail("Not Found", ["Article not found"]));
    }

    if (article.authorId !== user.id) {
      return res.status(403).json(fail("Forbidden", ["Forbidden"]));
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
      },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json(ok("Article updated", updated));
  } catch (e) {
    next(e);
  }
}

export async function deleteArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true, deletedAt: true },
    });

    if (!article || article.deletedAt) {
      return res.status(404).json(fail("Not Found", ["Article not found"]));
    }

    if (article.authorId !== user.id) {
      return res.status(403).json(fail("Forbidden", ["Forbidden"]));
    }

    await prisma.article.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res.json(ok("Article deleted", null));
  } catch (e) {
    next(e);
  }
}