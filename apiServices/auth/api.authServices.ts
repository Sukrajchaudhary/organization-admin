import { baseUrl } from "@/config/config";
import api from "../api.services";
import { handleApiResponse, handleApiError } from "@/lib/api-handlers";
import {ApiResponse } from "@/types/api";
import { User } from "@/types/auth/authType";

export async function LoginUser(body: { email: string; password: string }): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`${baseUrl}${api.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await handleApiResponse<User>(response);
  } catch (error) {
    throw handleApiError(error);
  }
}
