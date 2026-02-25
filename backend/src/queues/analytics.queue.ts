import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const ANALYTICS_QUEUE = "analytics";

export const analyticsQueue = new Queue(ANALYTICS_QUEUE, {
  connection: redis,
});