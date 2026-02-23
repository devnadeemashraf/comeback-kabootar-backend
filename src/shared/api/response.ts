import type { Response } from 'express';

/** Success JSON body: { success: true, data: T }. */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

/** Error payload inside failure response; optional code for client handling. */
export interface ErrorPayload {
  message: string;
  code?: string;
}

/** Failure JSON body: { success: false, error: ErrorPayload }. */
export interface FailureResponse {
  success: false;
  error: ErrorPayload;
}

export function ok<T>(res: Response, data: T): void {
  const body: SuccessResponse<T> = { success: true, data };
  res.status(200).json(body);
}

export function created<T>(res: Response, data: T): void {
  const body: SuccessResponse<T> = { success: true, data };
  res.status(201).json(body);
}

export function noContent(res: Response): void {
  res.status(204).send();
}

function failureBody(message: string, code?: string): FailureResponse {
  return { success: false, error: code ? { message, code } : { message } };
}

export function unauthorized(res: Response, message = 'Unauthorized', code?: string): void {
  res.status(401).json(failureBody(message, code));
}

export function validationError(res: Response, message = 'Validation failed', code?: string): void {
  res.status(422).json(failureBody(message, code));
}

export function notFound(res: Response, message = 'Resource not found', code?: string): void {
  res.status(404).json(failureBody(message, code));
}

export function internalError(res: Response, message = 'Internal Server Error'): void {
  res.status(500).json(failureBody(message));
}

/** Send error response with custom status (e.g. for error middleware mapping AppError). */
export function errorWithStatus(
  res: Response,
  status: number,
  message: string,
  code?: string,
): void {
  res.status(status).json(failureBody(message, code));
}
