export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code?: string) {
    super(message, code, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', code?: string) {
    super(message, code, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', code?: string) {
    super(message, code, 403);
    this.name = 'ForbiddenError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 422);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 409);
    this.name = 'ConflictError';
  }
}

export class DomainError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 422);
    this.name = 'DomainError';
  }
}
