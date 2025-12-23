import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { Trip } from "@/types/trip/tripTypes";

export async function getTrips(params?: { page?: number; limit?: number }): Promise<ApiResponse<Trip[]>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.trip.list}?${queryString}` : api.trip.list;
  return apiClient.get<Trip[]>(endpoint);
}

export async function getTripById(id: string): Promise<ApiResponse<Trip>> {
  return apiClient.get<Trip>(`${api.trip.getByid}/${id}`);
}

export async function createTrip(data: Partial<Trip>): Promise<ApiResponse<Trip>> {
  return apiClient.post<Trip>(api.trip.create, data);
}

export async function updateTrip(id: string, data: Partial<Trip>): Promise<ApiResponse<Trip>> {
  return apiClient.put<Trip>(`${api.trip.list}/${id}`, data);
}

export async function deleteTrip(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`${api.trip.list}/${id}`);
}
