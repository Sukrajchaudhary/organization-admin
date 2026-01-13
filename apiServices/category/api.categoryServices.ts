import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { replacePathParams } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { RootCategoryData, CreateCategoryData } from "@/types/categoryTypes/categoryTypes";

export async function getCategories(params?: { page?: number; limit?: number; isActive?: boolean }): Promise<ApiResponse<RootCategoryData[]>> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;

  // Build request body matching the API documentation
  const body: Record<string, any> = {
    page,
    limit,
    isActive: params?.isActive ?? true,
  };

  const response = await apiClient.post<RootCategoryData[]>(api.categories.list, body);

  // Transform response to include pagination object expected by CrudTable
  const total = (response as any).total || response.data?.length || 0;
  const pages = (response as any).pages || Math.ceil(total / limit) || 1;

  return {
    ...response,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
}

export async function getCategoryById(id: string): Promise<ApiResponse<RootCategoryData>> {
  return apiClient.get<RootCategoryData>(replacePathParams(api.categories.getCategoryById, { id }));
}

export async function createCategory(data: CreateCategoryData): Promise<ApiResponse<RootCategoryData>> {
  return apiClient.post<RootCategoryData>(api.categories.create, data);
}

export async function updateCategory(id: string, data: Partial<CreateCategoryData>): Promise<ApiResponse<RootCategoryData>> {
  const endpoint = replacePathParams(api.categories.update, { id });
  return apiClient.post<RootCategoryData>(endpoint, data);
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  const endpoint = replacePathParams(api.categories.delete, { id });
  return apiClient.post<void>(endpoint, {});
}

