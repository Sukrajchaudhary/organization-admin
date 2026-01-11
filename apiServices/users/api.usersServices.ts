import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { replacePathParams } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/authTypes/authType";

export interface UserFilters {
  search?: string;
  locations?: string[];
  skills?: string[];
  deliverables?: string[];
  projects?: string[];
  isPremium?: boolean;
  accountType?: string;
  page?: number;
  limit?: number;
}

// Optimized helper for simple ID-based state changes
const userAction = (endpoint: string, params: Record<string, string>) => 
  apiClient.put<User>(replacePathParams(endpoint, params), {});

export const getUsers = (filters: UserFilters = {}) => 
  apiClient.post<User[]>(api.users.list, filters);

export const getPublicUsers = () => 
  apiClient.get<User[]>(api.auth.list, { requiresAuth: false });

export const getUserById = (id: string) => 
  apiClient.get<User>(`${api.auth.list}/${id}`);

export const updateUser = (id: string, data: Partial<User>) => 
  apiClient.put<User>(`${api.auth.list}/${id}`, data);

export const deleteUser = (id: string) => 
  apiClient.delete<void>(`${api.auth.list}/${id}`);

export const createUser = (data: Omit<User, "_id" | "createdAt" | "updatedAt" | "__v">) => 
  apiClient.post<User>(api.auth.list, data);

// State change functions using the optimized helper
export const deactivateUser = (id: string) => userAction(api.users.deactive, { id });
export const activateUser = (id: string) => userAction(api.users.active, { id });
export const blockUser = (id: string) => userAction(api.users.block, { userId: id });
export const unblockUser = (id: string) => userAction(api.users.unblock, { userId: id });
export const upgradeUser = (id: string) => userAction(api.users.upgrade, { id });
export const makeUserPaid = (id: string) => userAction(api.users.paid, { id });
export const revokeUserPaid = (id: string) => userAction(api.users.revokePaid, { id });

