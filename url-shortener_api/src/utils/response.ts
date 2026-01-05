// Standard API response format
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

// Success response
export const successResponse = <T = any>(
  message: string,
  data?: T
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

// Error response (used by error middleware)
export const errorResponse = (
  message: string,
  statusCode: number,
  details?: string
) => {
  return {
    success: false,
    message,
    statusCode,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  };
};
