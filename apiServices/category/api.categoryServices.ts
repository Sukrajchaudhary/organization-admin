import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { Category, CategoryCreate, CategoryUpdate } from "@/types/categoryTypes/categoryTypes";

export async function getCategories(params?: { page?: number; limit?: number }): Promise<ApiResponse<Category[]>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.categories.list}?${queryString}` : api.categories.list;
  return apiClient.get<Category[]>(endpoint);
}

export async function createCategory(data: CategoryCreate): Promise<ApiResponse<Category>> {
  return apiClient.post<Category>(api.categories.create, data);
}

export async function updateCategory(id: string, data: CategoryUpdate): Promise<ApiResponse<Category>> {
  const endpoint = api.categories.update.replace('{id}', id);
  return apiClient.put<Category>(endpoint, data);
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  const endpoint = api.categories.delete.replace('{id}', id);
  return apiClient.delete<void>(endpoint);
}

