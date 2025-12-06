// import { getAuthToken } from './auth';
// import { handleApiResponse, handleApiError } from './api-handlers';
// import { ApiResponse } from '@/types/api';

// interface ApiClientOptions extends RequestInit {
//   requiresAuth?: boolean;
// }

// class ApiClient {
//   private baseUrl: string;

//   constructor(baseUrl: string) {
//     this.baseUrl = baseUrl;
//   }

//   private async getAuthHeaders(): Promise<Record<string, string>> {
//     const token = await getAuthToken();
//     const headers: Record<string, string> = {};

//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     return headers;
//   }

//   async request<T>(
//     endpoint: string,
//     options: ApiClientOptions = {}
//   ): Promise<ApiResponse<T>> {
//     const { requiresAuth = true, headers = {}, body, ...restOptions } = options;

//     try {
//       const authHeaders = requiresAuth ? await this.getAuthHeaders() : {};
//       // Only set Content-Type for non-FormData bodies
//       if (!(body instanceof FormData)) {
//         authHeaders['Content-Type'] = 'application/json';
//       }
//       const allHeaders = { ...authHeaders, ...headers };
//       const response = await fetch(`${this.baseUrl}${endpoint}`, {
//         ...restOptions,
//         headers: allHeaders,
//       });

//       return await handleApiResponse<T>(response);
//     } catch (error) {
//       throw handleApiError(error);
//     }
//   }

//   // Convenience methods for common HTTP methods
//   async get<T>(endpoint: string, options?: Omit<ApiClientOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { ...options, method: 'GET' });
//   }

//   async post<T>(endpoint: string, data?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, {
//       ...options,
//       method: 'POST',
//       body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
//     });
//   }

//   async put<T>(endpoint: string, data?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, {
//       ...options,
//       method: 'PUT',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   async patch<T>(endpoint: string, data?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, {
//       ...options,
//       method: 'PATCH',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   async delete<T>(endpoint: string, options?: Omit<ApiClientOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
//     return this.request<T>(endpoint, { ...options, method: 'DELETE' });
//   }
// }

// // Create and export a default instance
// const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL || '';
// export const apiClient = new ApiClient(baseUrl);

// // Export the class for custom instances if needed
// export default ApiClient;

import { getAuthToken } from "./auth";
import { handleApiResponse, handleApiError } from "./api-handlers";
import { ApiResponse } from "@/types/api";

interface ApiClientOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, headers = {}, body, ...restOptions } = options;

    try {
      const authHeaders = requiresAuth ? await this.getAuthHeaders() : {};
      if (body && !(body instanceof FormData)) {
        authHeaders["Content-Type"] = "application/json";
      }
      const allHeaders = { ...authHeaders, ...headers };
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...restOptions,
        headers: allHeaders,
        body,
      });

      return await handleApiResponse<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Convenience methods for common HTTP methods
  async get<T>(
    endpoint: string,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: Omit<ApiClientOptions, "method" | "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Create and export a default instance
const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL || "";
export const apiClient = new ApiClient(baseUrl);
export default ApiClient;
