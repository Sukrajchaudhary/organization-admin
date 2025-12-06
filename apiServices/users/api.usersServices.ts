import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/authTypes/authType";
// import { User } from "@/types/auth/authType";

// Get all users (protected route)
export async function getUsers(): Promise<ApiResponse<User[]>> {
  return apiClient.get<User[]>(api.auth.list);
}

// Example: Get public users (public route, no token required)
export async function getPublicUsers(): Promise<ApiResponse<User[]>> {
  return apiClient.get<User[]>(api.auth.list, { requiresAuth: false });
}

// Get user by ID (protected route)
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  return apiClient.get<User>(`${api.auth.list}/${id}`);
}

// Update user (protected route)
export async function updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
  return apiClient.put<User>(`${api.auth.list}/${id}`, data);
}

// Delete user (protected route)
export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`${api.auth.list}/${id}`);
}

// Create user (protected route - admin only)
export async function createUser(data: Omit<User, '_id' | 'createdAt' | 'updatedAt' | '__v'>): Promise<ApiResponse<User>> {
  return apiClient.post<User>(api.auth.list, data);
}