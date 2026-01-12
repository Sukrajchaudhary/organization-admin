import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { replacePathParams } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { RootCategoryData, CreateCategoryData } from "@/types/categoryTypes/categoryTypes";

export async function getCategories(params?: { page?: number; limit?: number }): Promise<ApiResponse<RootCategoryData[]>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.categories.list}?${queryString}` : api.categories.list;
  return apiClient.post<RootCategoryData[]>(endpoint,{});
}

export async function getCategoryById(id: string): Promise<ApiResponse<RootCategoryData>> {
  return apiClient.get<RootCategoryData>(replacePathParams(api.categories.getCategoryById, { id }));
}

export async function createCategory(data: CreateCategoryData): Promise<ApiResponse<RootCategoryData>> {
  return apiClient.post<RootCategoryData>(api.categories.create, data);
}

export async function updateCategory(id: string, data: Partial<CreateCategoryData>): Promise<ApiResponse<RootCategoryData>> {
  const endpoint = replacePathParams(api.categories.update, { id });
  return apiClient.put<RootCategoryData>(endpoint, data);
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  const endpoint = replacePathParams(api.categories.delete, { id });
  return apiClient.delete<void>(endpoint);
}

