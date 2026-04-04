import { config } from "@/config";

import { prisma } from "@/utils/prisma";
import { cacheGet, cacheSet, getRedis } from "@/utils/redis";

/**
 * List of officially tracked events to ensure consistency.
 */

const KNOWN_EVENTS = [
  "resume_created",
  "resume_deleted",
  "resume_exported",
  "auth_otp_sent",
  "auth_login_success",
  "dashboard_opened",
  "roadmap_viewed",
] as const;

type KnownEvent = (typeof KNOWN_EVENTS)[number];

interface UsageIncrementPayload {
  event: string;
  value?: number;
}

/**
 * Helper to generate a YYYY-MM-DD string key for Redis.
 */

function toDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Converts a YYYY-MM-DD string back to a UTC Date object for Prisma.
 */

function fromDateKeyToUtcDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

/**
 * Generates a Redis key for the daily usage hash.
 */

function usageRedisKey(dateKey: string) {
  return `usage:daily:${dateKey}`;
}

/**
 * Sanitizes and normalizes event names.
 */

function toEventField(event: string) {
  const normalized = event.trim().toLowerCase().replace(/\s+/g, "_");

  if ((KNOWN_EVENTS as readonly string[]).includes(normalized)) {
    return normalized as KnownEvent;
  }

  return normalized.startsWith("custom_") ? normalized : `custom_${normalized}`;
}

/**
 * Validates and constrains the increment value (1 to 1000).
 */

function sanitizeIncrementValue(value?: number) {
  const numeric = Math.floor(Number(value ?? 1));
  return isFinite(numeric) ? Math.max(1, Math.min(1000, numeric)) : 1;
}

/**
 * Atomic increment of a metric in Redis with a rolling expiration.
 * * payload: Contains the event name and optional increment value.
 */

export async function incrementUsageMetric(payload: UsageIncrementPayload) {
  const redis = getRedis();

  const event = toEventField(payload.event);
  const amount = sanitizeIncrementValue(payload.value);

  const key = usageRedisKey(toDateKey());

  const ttl = Math.max(1, config.metrics.redisRetentionDays) * 24 * 60 * 60;

  // Use a pipeline if you need to set more than one command for performance
  await redis.hIncrBy(key, event, amount);
  await redis.expire(key, ttl);
}

/**
 * Retrieve all metrics stored in Redis for a specific date.
 */

export async function getUsageSnapshotForDate(date = new Date()) {
  const redis = getRedis();
  const key = usageRedisKey(toDateKey(date));

  return redis.hGetAll(key);
}

/**
 * Moves metrics from Redis to Postgres in a single transaction.
 * * date: The date for which metrics should be persisted.
 * * returns: Metadata about the flushed records.
 */

export async function flushUsageMetricsForDate(date: Date) {
  const redis = getRedis();

  const dateKey = toDateKey(date);
  const key = usageRedisKey(dateKey);

  const snapshot = await redis.hGetAll(key);

  const entries = Object.entries(snapshot);

  if (entries.length === 0) return { dateKey, flushedEvents: 0 };

  const metricDate = fromDateKeyToUtcDate(dateKey);

  await prisma.$transaction(
    entries.map(([event, rawCount]) => {
      const count = parseInt(rawCount, 10);

      return prisma.usageMetricDaily.upsert({
        where: { date_event: { date: metricDate, event } },
        create: { date: metricDate, event, count },
        update: { count: { increment: count } },
      });
    }),
  );

  await redis.del(key);
  return { dateKey, flushedEvents: entries.length };
}

/**
 * Aggregates real-time Redis data with historical Postgres data for Admin Dashboard.
 * * returns: A comprehensive snapshot of today's and all-time metrics.
 */

export async function getAdminDashboardMetrics() {
  const cacheKey = "admin:dashboard:stats";
  const cached = await cacheGet(cacheKey);

  if (cached) return cached;

  const [todaySnapshot, totals] = await Promise.all([
    getUsageSnapshotForDate(new Date()),
    prisma.usageMetricDaily.groupBy({
      by: ["event"],
      _sum: { count: true },
    }),
  ]);

  const totalByEvent = Object.fromEntries(totals.map((row) => [row.event, row._sum.count ?? 0]));

  const parseToday = (key: string) => parseInt(todaySnapshot[key] ?? "0", 10);

  const response = {
    generatedAt: new Date().toISOString(),

    today: {
      resumeCreated: parseToday("resume_created"),
      resumeExported: parseToday("resume_exported"),
      loginSuccess: parseToday("auth_login_success"),
      raw: todaySnapshot,
    },

    totals: {
      resumeCreated: totalByEvent.resume_created ?? 0,
      resumeDeleted: totalByEvent.resume_deleted ?? 0,
      resumeExported: totalByEvent.resume_exported ?? 0,
      loginSuccess: totalByEvent.auth_login_success ?? 0,
      otpSent: totalByEvent.auth_otp_sent ?? 0,
      dashboardOpened: totalByEvent.dashboard_opened ?? 0,
      roadmapViewed: totalByEvent.roadmap_viewed ?? 0,
    },
  };

  await cacheSet(cacheKey, response, 1800);

  return response;
}
