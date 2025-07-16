export class ApiError extends Error {
  statusCode: number | undefined;
  originalError: any;

  constructor(message: string, statusCode?: number, originalError?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
} 