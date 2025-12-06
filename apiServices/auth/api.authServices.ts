import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import {ApiResponse } from "@/types/api";
import { User } from "@/types/authTypes/authType";
export async function LoginUser(body: { email: string; password: string }): Promise<ApiResponse<User>> {
  // Login doesn't require auth token
  return apiClient.post<User>(api.auth.login, body, { requiresAuth: false });
}
