import { ApiError } from './errors';

export async function apiWrapper<T>(fn: () => Promise<{ data: T; error: any }>, context?: string): Promise<T> {
  try {
    const { data, error } = await fn();
    if (error) {
      // Log error (future: send to logging service)
      console.error(`[API ERROR]${context ? ' [' + context + ']' : ''}:`, error);
      throw new ApiError(error.message || 'API Error', error.status || 500, error);
    }
    return data;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    // Log unexpected error
    console.error(`[API UNEXPECTED ERROR]${context ? ' [' + context + ']' : ''}:`, err);
    throw new ApiError(err.message || 'Unexpected API Error', 500, err);
  }
} 