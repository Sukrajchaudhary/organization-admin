"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "@/apiServices/blog/api.blogServices";
import BlogForm from "@/components/blog/BlogForm";
import BlogEditSkeleton from "@/components/blog/BlogEditSkeleton";
import { useBlogForm } from "@/hooks/useBlogForm";
export default function EditBlogPage() {
  const params = useParams();
  const blogId = params.id as string;
  // Fetch blog data
  const { data: blogData, isLoading: isFetching } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const response = await getBlogById(blogId);
      return response.data;
    },
    enabled: !!blogId,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Initialize form with hook
  const { form, isLoading, onSubmit, resetForm } = useBlogForm({
    mode: "edit",
    blogId,
    draftKey: `edit-blog-${blogId}`,
  });

  // Reset form when blog data is loaded
  useEffect(() => {
    if (blogData) {
      resetForm({
        title: blogData.title,
        description: blogData.description,
        slug: blogData.slug,
        image: blogData.image,
        categories:
          blogData.categories?.map((c: any) =>
            typeof c === "object" ? c._id || c.id : c
          ) || [],
        readTime: blogData.readTime,
        status: (blogData.status?.toLowerCase() as "published" | "draft") || "draft",
        draft: blogData.draft,
        meta: {
          title: blogData.meta?.title || "",
          description: blogData.meta?.description || "",
          keywords: blogData.meta?.keywords || [],
        },
      });
    }
  }, [blogData, resetForm]);

  if (isFetching) {
    return <BlogEditSkeleton />;
  }

  if (!blogData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Blog not found</p>
      </div>
    );
  }

  return (
    <BlogForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode="edit"
      showBackButton={true}
    />
  );
}