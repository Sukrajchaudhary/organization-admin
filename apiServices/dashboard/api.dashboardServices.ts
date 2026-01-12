import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import {
  DashboardStats,
  DateRangeFilter,
  MonthlyRegistrationsResponse,
  YearlyRegistrationsResponse,
  DateRangeRegistrationsResponse,
} from "@/types/dashboardTypes/dashboardTypes";

export async function getDashboardStats(
  filter?: DateRangeFilter
): Promise<ApiResponse<DashboardStats>> {
  let url = api.dashboard.stats;
  if (filter?.startDate && filter?.endDate) {
    url += `?startDate=${filter.startDate}&endDate=${filter.endDate}`;
  }
  return apiClient.get<DashboardStats>(url);
}

export async function getDashboardAnalytics(): Promise<ApiResponse<any>> {
  return apiClient.get<any>(api.dashboard.analytics);
}

export async function getMonthlyRegistrations(
  year?: number
): Promise<ApiResponse<MonthlyRegistrationsResponse>> {
  let url = api.dashboard.registrationsMonthly;
  if (year) {
    url += `?year=${year}`;
  }
  return apiClient.get<MonthlyRegistrationsResponse>(url);
}

export async function getYearlyRegistrations(
  startYear?: number,
  endYear?: number
): Promise<ApiResponse<YearlyRegistrationsResponse>> {
  let url = api.dashboard.registrationsYearly;
  const params = new URLSearchParams();
  if (startYear) params.append("startYear", startYear.toString());
  if (endYear) params.append("endYear", endYear.toString());
  if (params.toString()) url += `?${params.toString()}`;
  return apiClient.get<YearlyRegistrationsResponse>(url);
}

export async function getRegistrationsByDateRange(
  startDate: string,
  endDate: string
): Promise<ApiResponse<DateRangeRegistrationsResponse>> {
  const url = `${api.dashboard.registrationsRange}?startDate=${startDate}&endDate=${endDate}`;
  return apiClient.get<DateRangeRegistrationsResponse>(url);
}