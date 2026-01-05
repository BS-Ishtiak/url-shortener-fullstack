// Base error class
export class AppError extends Error {
  statusCode: number;
  details?: string;

  constructor(message: string, statusCode: number, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 400 - Validation error
export class ValidationError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 400, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// 401 - Authentication error
export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized', details?: string) {
    super(message, 401, details);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

// 403 - Forbidden error
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: string) {
    super(message, 403, details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// 404 - Not found error
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// 409 - Conflict error
export class ConflictError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 409, details);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// 500 - Internal server error
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error', details?: string) {
    super(message, 500, details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
