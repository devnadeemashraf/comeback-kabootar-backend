// --- Success (single resource or action) ---
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export function successResponse<T>(data: T): SuccessResponse<T> {
  return { success: true, data };
}

// --- Success (paginated) ---
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export function paginatedResponse<T>(data: T[], meta: PaginationMeta): PaginatedResponse<T> {
  return { success: true, data, meta };
}

// --- Failure (used by error middleware and by controllers in try/catch) ---
export interface ErrorPayload {
  message: string;
  code?: string;
}

export interface FailureResponse {
  success: false;
  error: ErrorPayload;
}

export function errorResponse(message: string, code?: string): FailureResponse {
  return { success: false, error: code ? { message, code } : { message } };
}
