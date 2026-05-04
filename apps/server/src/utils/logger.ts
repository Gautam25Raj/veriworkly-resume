enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL as keyof typeof LOG_LEVELS] ?? 2;

function formatTimestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  error: (message: string, error?: unknown) => {
    if (LOG_LEVELS.error <= currentLevel) {
      console.error(`[${formatTimestamp()}] [${LogLevel.ERROR}] ${message}`, error);
    }
  },

  warn: (message: string, data?: unknown) => {
    if (LOG_LEVELS.warn <= currentLevel) {
      console.warn(`[${formatTimestamp()}] [${LogLevel.WARN}] ${message}`, data);
    }
  },

  info: (message: string, data?: unknown) => {
    if (LOG_LEVELS.info <= currentLevel) {
      console.log(`[${formatTimestamp()}] [${LogLevel.INFO}] ${message}`, data);
    }
  },

  debug: (message: string, data?: unknown) => {
    if (LOG_LEVELS.debug <= currentLevel) {
      console.log(`[${formatTimestamp()}] [${LogLevel.DEBUG}] ${message}`, data);
    }
  },
};
