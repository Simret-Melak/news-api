import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { ok, fail } from "../../utils/response";

export async function readArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const rawId = (req.params as any).id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json(fail("Bad Request", ["Missing article id"]));
    }

    const article = await prisma.article.findFirst({
      where: {
        id,
        deletedAt: null,
        status: "Published",
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        status: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
      },
    });

    if (!article) {
      return res
        .status(404)
        .json(fail("News article no longer available", ["News article no longer available"]));
    }

    const readerId = req.user?.id ?? null;
    void prisma.readLog
      .create({
        data: {
          articleId: article.id,
          readerId, 
        },
      })
      .catch((err) => {
        console.error("ReadLog create failed:", err);
      });

    return res.json(ok("Article fetched", article));
  } catch (e) {
    next(e);
  }
}