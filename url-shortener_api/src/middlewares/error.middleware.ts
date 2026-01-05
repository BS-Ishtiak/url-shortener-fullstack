import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

// Custom error interface
export interface ApiError extends Error {
  statusCode?: number;
  details?: string;
}

// Global error handler - must be registered last
const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error with request context
  const errorLog = {
    requestId: req.id,
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message,
    statusCode: err.statusCode || 500,
    details: err.details || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  console.error(JSON.stringify(errorLog, null, 2));

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;

  // Send error response
  res.status(statusCode).json({
    error: err.name || "Error",
    message,
    requestId: req.id,
    ...(process.env.NODE_ENV === "development" && { details: err.details }),
  });
};

export default errorHandler;
