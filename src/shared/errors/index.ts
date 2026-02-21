/**
 * Custom error classes and error codes used across the app.
 * Entities and features can extend or use these without depending on infrastructure.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class DomainError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 422);
    this.name = 'DomainError';
  }
}
