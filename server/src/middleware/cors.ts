import cors from "cors";

import { config, isDevelopment } from "@/config";
import { ApiError } from "@/utils/errors";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if ((!origin && isDevelopment) || config.allowedOrigins.includes(origin || "")) {
      callback(null, true);
    } else {
      callback(new ApiError(403, "Not allowed by CORS"));
    }
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
});
