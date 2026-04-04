import { v4 as uuidv4 } from "uuid";
import cron, { ScheduledTask } from "node-cron";

import { config } from "#config";

import { logger } from "#utils/logger";
import { getRedis } from "#utils/redis";

import { shouldSyncGitHubStats, syncGitHubStatsFromGitHub } from "#services/statsService";

let job: ScheduledTask | null = null;

/**
 * Orchestrates the GitHub synchronization with distributed locking.
 * * reason: Context of the trigger (startup vs scheduled cron).
 */

async function runSync(reason: "startup" | "cron") {
  const redis = getRedis();

  const lockKey = "github:sync:lock";

  const lockValue = uuidv4();
  const lockTTL = 60 * 10;

  let lockAcquired = false;

  try {
    const lockResult = await redis.set(lockKey, lockValue, {
      NX: true,
      EX: lockTTL,
    });

    lockAcquired = lockResult === "OK";

    if (!lockAcquired) {
      logger.warn(`Skipping GitHub stats sync (${reason}): lock already held by another instance`);
      return;
    }

    const shouldSync = await shouldSyncGitHubStats();

    if (!shouldSync) {
      logger.info(`Skipping GitHub stats sync (${reason}): data is already up to date`);
      return;
    }

    const result = await syncGitHubStatsFromGitHub();

    logger.info(`GitHub stats sync (${reason}) completed`, {
      issueCount: result.issueCount,
      syncedAt: result.syncedAt,
    });
  } catch (error) {
    logger.error(`GitHub stats sync (${reason}) failed`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
  } finally {
    if (lockAcquired) {
      try {
        const currentLockValue = await redis.get(lockKey);

        if (currentLockValue === lockValue) {
          await redis.del(lockKey);
        }
      } catch (releaseError) {
        logger.error("Failed to release GitHub sync lock cleanly", releaseError);
      }
    }
  }
}

/**
 * Initializes and schedules the GitHub sync cron job.
 * Runs once on startup if enabled.
 */

export function startGitHubSyncJob() {
  const { syncEnabled, syncCron, syncTimezone } = config.github;

  if (!syncEnabled) {
    logger.info("GitHub sync job is globally disabled via config");
    return;
  }

  if (job) return;

  job = cron.schedule(
    syncCron,
    () => {
      void runSync("cron");
    },
    { timezone: syncTimezone },
  );

  logger.info("GitHub sync job scheduled", { cron: syncCron, timezone: syncTimezone });

  void runSync("startup");
}

/**
 * Stops the scheduled cron job and clears the job reference.
 */

export function stopGitHubSyncJob() {
  if (job) {
    job.stop();
    job = null;
    logger.info("GitHub sync job stopped");
  }
}
