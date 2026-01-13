import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { replacePathParams } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { RootPlanData, CreatePlanData } from "@/types/planTypes/planTypes";

export interface GetPlansParams {
  page?: number;
  limit?: number;
  type?: "monthly" | "yearly" | "lifetime";
  isActive?: boolean;
}

export async function getPlans(params?: GetPlansParams): Promise<ApiResponse<RootPlanData[]>> {
  const page = params?.page || 1;
  const limit = params?.limit || 10;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (params?.type) queryParams.append("type", params.type);
  if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.plans.list}?${queryString}` : api.plans.list;

  const response = await apiClient.get<RootPlanData[]>(endpoint);

  // Ensure pagination object exists for CrudTable compatibility
  if (!response.pagination) {
    const total = (response as any).total || 0;
    const pages = (response as any).pages || 1;
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

  return response;
}

export async function getPlanById(id: string): Promise<ApiResponse<RootPlanData>> {
  return apiClient.get<RootPlanData>(replacePathParams(api.plans.getById, { id }));
}

export async function createPlan(data: CreatePlanData): Promise<ApiResponse<RootPlanData>> {
  return apiClient.post<RootPlanData>(api.plans.create, data);
}

export async function updatePlan(id: string, data: Partial<CreatePlanData>): Promise<ApiResponse<RootPlanData>> {
  const endpoint = replacePathParams(api.plans.update, { id });
  return apiClient.put<RootPlanData>(endpoint, data);
}

export async function deletePlan(id: string): Promise<ApiResponse<void>> {
  const endpoint = replacePathParams(api.plans.delete, { id });
  return apiClient.delete<void>(endpoint);
}

export async function togglePlanStatus(id: string): Promise<ApiResponse<RootPlanData>> {
  const endpoint = replacePathParams(api.plans.toggleStatus, { id });
  return apiClient.patch<RootPlanData>(endpoint);
}