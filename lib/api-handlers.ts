import { ApiResponse, ApiError, ApiErrorDetails } from "@/types/api";
import { sessionExpiredEmitter } from "@/lib/session-events";

export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data: ApiResponse<T> = await response.json();
  if (!response.ok || !data.success) {
    const errorDetails: ApiErrorDetails | undefined = data.error;
    const message = errorDetails?.message || data.message || `HTTP error! status: ${response.status}`;
    // Check for authentication errors (401 Unauthorized or 403 Forbidden)
    if (response.status === 401 || response.status === 403) {
      // Emit session expired event for client-side handling
      sessionExpiredEmitter.emit();
    }

    throw new ApiError(message, response.status, errorDetails);
  }

  return data;
}

export function handleApiError(error: any): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unknown error occurred');
}