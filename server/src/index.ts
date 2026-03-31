import helmet from "helmet";
import express from "express";

import { config, isDevelopment } from "@/config";

import { logger } from "@/utils/logger";
import { prisma } from "@/utils/prisma";
import { initRedis, closeRedis } from "@/utils/redis";

import { corsMiddleware } from "@/middleware/cors";
import { loggingMiddleware } from "@/middleware/logging";
import { rateLimitMiddleware } from "@/middleware/rateLimit";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";

import statsRoutes from "@/routes/stats";
import healthRoutes from "@/routes/health";
import roadmapRoutes from "@/routes/roadmap";
import { authNodeHandler } from "@/auth";
import { ensureAdminUserExists, validateAuthRuntimeConfig } from "@/auth/runtime";

import { startGitHubSyncJob, stopGitHubSyncJob } from "@/jobs/githubSyncJob";

const app = express();

// Security middleware
app.use(helmet());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimitMiddleware);

// Logging middleware
app.use(loggingMiddleware);

// Trust proxy (for accurate IP addresses behind reverse proxies)
app.set("trust proxy", 1);

// Versioned API routes (primary)
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/roadmap", roadmapRoutes);
app.use("/api/v1/stats", statsRoutes);
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

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} (${config.nodeEnv})`);
      startGitHubSyncJob();

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
