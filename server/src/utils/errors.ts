import { z } from "zod";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleValidationError(error: z.ZodError): never {
  const formattedErrors = error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  throw new ApiError(400, "Validation failed", formattedErrors);
}

export function createSuccessResponse<T>(data: T, message = "Success") {
  return {
    success: true,
    message,
    data,
  };
}

export function createErrorResponse(statusCode: number, message: string, details?: unknown) {
  return {
    success: false,
    message,
    statusCode,
    details,
  };
}
