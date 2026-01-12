import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";

/**
 * Generic CRUD API factory
 * Creates standardized API functions for any resource
 */
export function createCrudApi<T, CreateData = Partial<T>>(endpoints: {
  list: string;
  getById?: string;
  create?: string;
  update?: string;
  delete?: string;
}) {
  return {
    /**
     * Get all items with pagination
     */
    getAll: async (params?: {
      page?: number;
      limit?: number;
    }): Promise<ApiResponse<T[]>> => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `${endpoints.list}?${queryString}`
        : endpoints.list;
      return apiClient.get<T[]>(endpoint);
    },

    /**
     * Get single item by ID
     */
    getById: endpoints.getById
      ? async (id: string): Promise<ApiResponse<T>> => {
          const endpoint = endpoints.getById!.replace("{id}", id);
          return apiClient.get<T>(endpoint);
        }
      : undefined,

    /**
     * Create new item
     */
    create: endpoints.create
      ? async (data: CreateData): Promise<ApiResponse<T>> => {
          return apiClient.post<T>(endpoints.create!, data);
        }
      : undefined,

    /**
     * Update existing item
     */
    update: endpoints.update
      ? async (id: string, data: Partial<CreateData>): Promise<ApiResponse<T>> => {
          const endpoint = endpoints.update!.replace("{id}", id);
          return apiClient.put<T>(endpoint, data);
        }
      : undefined,

    /**
     * Delete item by ID
     */
    delete: endpoints.delete
      ? async (id: string): Promise<ApiResponse<void>> => {
          const endpoint = endpoints.delete!.replace("{id}", id);
          return apiClient.delete<void>(endpoint);
        }
      : undefined,
  };
}

/**
 * Create a complete CRUD hook configuration
 * Returns query keys and mutation functions for React Query
 */
export function createCrudConfig<T>(
  resourceName: string,
  api: ReturnType<typeof createCrudApi<T>>
) {
  return {
    queryKeys: {
      all: [resourceName] as const,
      lists: () => [resourceName, "list"] as const,
      list: (filters: Record<string, any>) =>
        [resourceName, "list", filters] as const,
      details: () => [resourceName, "detail"] as const,
      detail: (id: string) => [resourceName, "detail", id] as const,
    },
    api,
  };
}