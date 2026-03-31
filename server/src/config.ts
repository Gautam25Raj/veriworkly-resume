import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "8080", 10),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(","),

  database: {
    url: process.env.DATABASE_URL || "",
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-key",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
  },

  cache: {
    roadmapTtlSeconds: parseInt(process.env.ROADMAP_CACHE_TTL_SECONDS || "2592000", 10),
    roadmapStatsTtlSeconds: parseInt(process.env.ROADMAP_STATS_CACHE_TTL_SECONDS || "2592000", 10),
    roadmapTagsTtlSeconds: parseInt(process.env.ROADMAP_TAGS_CACHE_TTL_SECONDS || "2592000", 10),
    githubStatsTtlSeconds: parseInt(process.env.GITHUB_STATS_CACHE_TTL_SECONDS || "43200", 10),
  },

  github: {
    owner: process.env.GITHUB_OWNER || "",
    repo: process.env.GITHUB_REPO || "",
    token: process.env.GITHUB_TOKEN || "",
    projectUrl: process.env.GITHUB_PROJECT_URL || "",
    syncCron: process.env.GITHUB_SYNC_CRON || "0 0,12 * * *",
    syncTimezone: process.env.GITHUB_SYNC_TIMEZONE || "UTC",
    syncEnabled: (process.env.GITHUB_SYNC_ENABLED || "true") === "true",
    syncApiKey: process.env.INTERNAL_SYNC_API_KEY || "",
  },
};

export const isDevelopment = config.nodeEnv === "development";
export const isProduction = config.nodeEnv === "production";
