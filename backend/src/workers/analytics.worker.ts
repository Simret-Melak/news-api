import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { ANALYTICS_QUEUE } from "../queues/analytics.queue";
import { processDailyAnalytics } from "./analytics.processor";

export const analyticsWorker = new Worker(
  ANALYTICS_QUEUE,
  async (job) => {
    return processDailyAnalytics(job.data);
  },
  { connection: redis }
);

analyticsWorker.on("completed", (job, result) => {
  console.log(`[analytics] job ${job.id} completed`, result);
});

analyticsWorker.on("failed", (job, err) => {
  console.error(`[analytics] job ${job?.id} failed`, err);
});