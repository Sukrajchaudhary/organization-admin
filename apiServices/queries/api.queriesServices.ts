import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { QueryFormData, querySchema } from "@/formschema/querySchema";

export interface QueryData extends QueryFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface QueriesResponse {
  queries: QueryData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getQueries(params?: { page?: number; limit?: number }): Promise<ApiResponse<QueriesResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.queries.list}?${queryString}` : api.queries.list;
  return apiClient.get<QueriesResponse>(endpoint);
}

export async function getQueryById(id: string): Promise<ApiResponse<QueryData>> {
  return apiClient.get<QueryData>(api.queries.getById.replace("{id}", id));
}

export async function createQuery(data: QueryFormData): Promise<ApiResponse<QueryData>> {
  const validatedData = querySchema.parse(data);
  return apiClient.post<QueryData>(api.queries.create, validatedData);
}

export async function updateQuery(id: string, data: Partial<QueryFormData>): Promise<ApiResponse<QueryData>> {
  const validatedData = querySchema.partial().parse(data);
  return apiClient.put<QueryData>(api.queries.update.replace("{id}", id), validatedData);
}

export async function deleteQuery(id: string): Promise<ApiResponse<void>> {
 return apiClient.delete<void>(api.queries.delete.replace("{id}",id));
}
