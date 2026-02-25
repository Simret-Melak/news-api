import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";

export async function publicFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(String(req.query.size ?? "10"), 10) || 10, 1), 100);
    const skip = (page - 1) * size;

    const category = typeof req.query.category === "string" ? req.query.category.trim() : undefined;
    const author = typeof req.query.author === "string" ? req.query.author.trim() : undefined;
    const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;

    const where: any = {
      status: "Published",
      deletedAt: null,
      ...(category ? { category } : {}),
      ...(q
        ? {
            title: {
              contains: q,
              mode: "insensitive",
            },
          }
        : {}),
      ...(author
        ? {
            author: {
              name: {
                contains: author,
                mode: "insensitive",
              },
            },
          }
        : {}),
    };

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
          createdAt: true,
          author: { select: { id: true, name: true } },
        },
      }),
    ]);

    return res.json({
      Success: true,
      Message: "Public feed",
      Object: items,
      PageNumber: page,
      PageSize: size,
      TotalSize: total,
      Errors: null,
    });
  } catch (e) {
    next(e);
  }
}