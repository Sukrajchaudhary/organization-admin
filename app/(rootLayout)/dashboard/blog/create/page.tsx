"use client";
import BlogForm from "@/components/blog/BlogForm";
import { useBlogForm } from "@/hooks/useBlogForm";
export default function CreateBlogPage() {
  const { form, isLoading, onSubmit } = useBlogForm({
    mode: "create",
    draftKey: "create-blog",
  });
  return (
    <BlogForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode="create"
      showBackButton={false}
    />
  );
}