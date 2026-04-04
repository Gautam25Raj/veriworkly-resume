import { config } from "#config";

import { logger } from "#utils/logger";
import { prisma } from "#utils/prisma";
import { initRedis, closeRedis } from "#utils/redis";

import { syncGitHubStatsFromGitHub } from "#services/statsService";

async function run() {
  try {
    await initRedis();
    await prisma.$queryRaw`SELECT 1`;

    if (!config.github.syncEnabled) {
      logger.info("GitHub sync is disabled. Exiting.");
      return;
    }

    const result = await syncGitHubStatsFromGitHub();

    logger.info("Manual GitHub sync completed", {
      issueCount: result.issueCount,
      syncedAt: result.syncedAt,
    });
  } catch (error) {
    logger.error("Manual GitHub sync failed", error);
    process.exitCode = 1;
  } finally {
    await closeRedis();
    await prisma.$disconnect();
  }
}

void run();
