import type { Request, Response, NextFunction } from "express";
import { analyticsQueue } from "../../queues/analytics.queue";
import { ok, fail } from "../../utils/response";

export async function runAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const day = typeof req.query.day === "string" ? req.query.day.trim() : undefined;

    if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return res.status(400).json(fail("Bad Request", ["day must be in YYYY-MM-DD format"]));
    }

    const job = await analyticsQueue.add("daily-analytics", { day });

    return res.json(
      ok("Analytics job queued", {
        jobId: job.id,
        day: day ?? "yesterday (UTC)",
      })
    );
  } catch (e) {
    next(e);
  }
}