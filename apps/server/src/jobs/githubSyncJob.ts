import { v4 as uuidv4 } from "uuid";
import cron, { ScheduledTask } from "node-cron";

import { config } from "#config";
import { logger } from "#utils/logger";
import { getRedis } from "#utils/redis";

import { shouldSyncGitHubStats, syncGitHubStatsFromGitHub } from "#services/githubService";

let job: ScheduledTask | null = null;

async function runSync(reason: "startup" | "cron") {
  const redis = getRedis();
  const lockValue = uuidv4();

  const lockKey = "github:sync:lock";

  const lockTTL = 600;

  let lockAcquired = false;

  try {
    const lockResult = await redis.set(lockKey, lockValue, {
      NX: true,
      EX: lockTTL,
    });

    lockAcquired = lockResult === "OK";

    if (!lockAcquired) {
      logger.debug(`GitHub sync (${reason}) locked by another instance. Skipping.`);
      return;
    }

    const needsSync = await shouldSyncGitHubStats();

    if (!needsSync) {
      logger.info(`GitHub sync (${reason}) skipped: Data is fresh.`);
      return;
    }

    const result = await syncGitHubStatsFromGitHub();

    logger.info(`GitHub sync (${reason}) success`, {
      itemsSynced: result.issueCount,
      syncedAt: result.syncedAt,
    });
  } catch (error) {
    logger.error(`GitHub sync (${reason}) failed`, {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (lockAcquired) {
      try {
        const currentLockValue = await redis.get(lockKey);

        if (currentLockValue === lockValue) {
          await redis.del(lockKey);
        }
      } catch (err) {
        logger.error("Lock release error", err);
      }
    }
  }
}

export function startGitHubSyncJob() {
  const { syncEnabled, syncCron, syncTimezone } = config.github;

  if (!syncEnabled) {
    logger.warn("GitHub sync is disabled in config.");
    return;
  }

  if (job) return;

  job = cron.schedule(syncCron, () => void runSync("cron"), { timezone: syncTimezone });

  logger.info("GitHub sync cron started", { schedule: syncCron });

  void runSync("startup");
}

export function stopGitHubSyncJob() {
  if (job) {
    job.stop();
    job = null;

    logger.info("GitHub sync cron stopped.");
  }
}
