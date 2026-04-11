import helmet from "helmet";
import express from "express";

import { config, isDevelopment } from "#config";

import { logger } from "#utils/logger";
import { prisma } from "#utils/prisma";
import { initRedis, closeRedis } from "#utils/redis";

import { corsMiddleware } from "#middleware/cors";
import { loggingMiddleware } from "#middleware/logging";
import { rateLimitMiddleware } from "#middleware/rateLimit";
import { errorHandler, notFoundHandler } from "#middleware/errorHandler";

import userRoutes from "#routes/users";
import shareRoutes from "#routes/share";
import statsRoutes from "#routes/stats";
import githubRoutes from "#routes/github";
import healthRoutes from "#routes/health";
import exportRoutes from "#routes/exports";
import resumeRoutes from "#routes/resumes";
import roadmapRoutes from "#routes/roadmap";
import profileRoutes from "#routes/profiles";
import shareControllerRoutes from "#routes/shares";

import { authNodeHandler } from "#auth/index";
import { ensureAdminUserExists, validateAuthRuntimeConfig } from "#auth/runtime";

import { closeExportBrowser } from "#services/exportService";
import { startExportQueueWorker, stopExportQueueCleanup } from "#services/exportQueueService";

import { startGitHubSyncJob, stopGitHubSyncJob } from "#jobs/githubSyncJob";
import { startUsageMetricsJob, stopUsageMetricsJob } from "#jobs/usageMetricsJob";

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimitMiddleware);

// Logging middleware
app.use(loggingMiddleware);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (for accurate IP addresses behind reverse proxies)
app.set("trust proxy", true);

// Versioned API routes (primary)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/v1/github", githubRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/exports", exportRoutes);
app.use("/api/v1/resumes", resumeRoutes);
app.use("/api/v1/roadmap", roadmapRoutes);
app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/share-links", shareRoutes);
app.use("/api/v1/shares", shareControllerRoutes);

app.all("/api/v1/auth/*", authNodeHandler);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
async function shutdown() {
  logger.info("Shutting down gracefully...");

  try {
    stopGitHubSyncJob();
    stopUsageMetricsJob();
    stopExportQueueCleanup();

    await closeExportBrowser();
    await closeRedis();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start server
async function main() {
  try {
    validateAuthRuntimeConfig();

    // Initialize Redis
    await initRedis();
    logger.info("Redis initialized");

    // Test database connection
    logger.info("Database connected");

    await ensureAdminUserExists();
    await startExportQueueWorker();

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} (${config.nodeEnv})`);
      startGitHubSyncJob();
      startUsageMetricsJob();

      if (isDevelopment) {
        logger.info(`Allowed origins: ${config.allowedOrigins.join(", ")}`);
        logger.info(`http://localhost:${config.port}/api/v1/health`);
      }
    });

    // Handle server errors
    server.on("error", (err) => {
      logger.error("Server error:", err);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();

export default app;
