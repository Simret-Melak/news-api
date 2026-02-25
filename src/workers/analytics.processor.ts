import { prisma } from "../config/prisma";
import { startOfUtcDay, startOfNextUtcDay } from "../utils/gmtDay";

export type AnalyticsJobData = {
  day?: string;
};

export async function processDailyAnalytics(data: AnalyticsJobData) {
  const now = new Date();
  const yesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
  const target = data.day ? new Date(`${data.day}T00:00:00.000Z`) : yesterday;

  const dayStart = startOfUtcDay(target);
  const dayEnd = startOfNextUtcDay(target);

  const grouped = await prisma.readLog.groupBy({
    by: ["articleId"],
    where: {
      readAt: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
    _count: { _all: true },
  });

 
  const dateKey = dayStart;

  await prisma.$transaction(
    grouped.map((g) =>
      prisma.dailyAnalytics.upsert({
        where: {
          articleId_date: {
            articleId: g.articleId,
            date: dateKey,
          },
        },
        create: {
          articleId: g.articleId,
          date: dateKey,
          viewCount: g._count._all,
        },
        update: {
          viewCount: g._count._all,
        },
      })
    )
  );

  return {
    day: dateKey.toISOString(),
    articlesProcessed: grouped.length,
  };
}