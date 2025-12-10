import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { mediaTypes } from "@/types/mediaTypes/mediaTypes";
import { NotificationData } from "@/types/notificationTypes/notificationTypes";

export async function getAllNotifications(params?: { page?: number; limit?: number }): Promise<ApiResponse<NotificationData[]>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.notifications.list}?${queryString}` : api.notifications.list;
  return apiClient.get<NotificationData[]>(endpoint);
}
