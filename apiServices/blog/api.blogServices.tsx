import api from "../api.services";
import { apiClient } from "@/lib/api-client";
import { replacePathParams } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { RootBlogsData, CreateBlogData } from "@/types/blogTypes/blogTypes";
export async function getBlogs(params?: { page?: number; limit?: number }): Promise<ApiResponse<RootBlogsData[]>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  const queryString = queryParams.toString();
  const endpoint = queryString ? `${api.blogs.list}?${queryString}` : api.blogs.list;
  return apiClient.get<RootBlogsData[]>(endpoint);
}

export async function getBlogById(id: string): Promise<ApiResponse<RootBlogsData>> {
  return apiClient.get<RootBlogsData>(replacePathParams(api.blogs.getBlogById, { id }));
}

export async function createBlog(data: CreateBlogData): Promise<ApiResponse<RootBlogsData>> {
  return apiClient.post<RootBlogsData>(api.blogs.create, data);
}

export async function updateBlog(id: string, data: Partial<CreateBlogData>): Promise<ApiResponse<RootBlogsData>> {
  return apiClient.put<RootBlogsData>(replacePathParams(api.blogs.update, { id }), data);
}
export async function deleteBlog(id: string): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(replacePathParams(api.blogs.delete, { id }));
}

