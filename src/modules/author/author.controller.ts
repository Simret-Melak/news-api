import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";

export async function dashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const authorId = req.user!.id;

    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const size = Math.min(Math.max(parseInt(String(req.query.size ?? "10"), 10) || 10, 1), 100);
    const skip = (page - 1) * size;

    const where = {
      authorId,
      deletedAt: null,
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
          createdAt: true,
          analytics: { select: { viewCount: true } }, 
        },
      }),
    ]);

    const result = items.map((a) => ({
      title: a.title,
      createdAt: a.createdAt,
      totalViews: a.analytics.reduce((sum, r) => sum + r.viewCount, 0),
    }));

    return res.json({
      Success: true,
      Message: "Author dashboard",
      Object: result,
      PageNumber: page,
      PageSize: size,
      TotalSize: total,
      Errors: null,
    });
  } catch (e) {
    next(e);
  }
}