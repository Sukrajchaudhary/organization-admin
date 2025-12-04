import { ApiResponse, ApiError, ApiErrorDetails } from "@/types/api";

export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    const errorDetails: ApiErrorDetails | undefined = data.error;
    const message = errorDetails?.message || data.message || `HTTP error! status: ${response.status}`;
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