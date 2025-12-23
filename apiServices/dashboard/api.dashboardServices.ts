import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { DashboardStats } from "@/types/dashboardTypes/dashboardTypes";

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return apiClient.get<DashboardStats>(api.dashboard.stats);
}

export async function getDashboardAnalytics(): Promise<ApiResponse<any>> {
  return apiClient.get<any>(api.dashboard.analytics);
}