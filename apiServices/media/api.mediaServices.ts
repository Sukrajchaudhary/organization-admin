import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { mediaTypes } from "@/types/mediaTypes/mediaTypes";

export async function getMedia(params?: { page?: number; limit?: number }): Promise<ApiResponse<mediaTypes[]>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.media.list}?${queryString}` : api.media.list;
  return apiClient.get<mediaTypes[]>(endpoint);
}
export async function uploadMedia(formData: FormData): Promise<mediaTypes[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL || '';
  try {
    const response = await fetch(`${baseUrl}media/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
// // Example: Get public users (public route, no token required)
// export async function getPublicUsers(): Promise<ApiResponse<User[]>> {
//   return apiClient.get<User[]>(api.auth.list, { requiresAuth: false });
// }


 // Delete media (protected route)
export async function deleteMedia(public_id: string): Promise<ApiResponse<void>> {
 return apiClient.post<void>(api.media.delete, { public_id });
}

