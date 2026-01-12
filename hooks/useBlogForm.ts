"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { blogSchema, BlogFormData } from "@/formschema/blogSchemas";
import { createBlog, updateBlog } from "@/apiServices/blog/api.blogServices";
import { useToast } from "@/hooks/use-toast";
import { useDraft } from "@/hooks/useDraft";
import { ApiError } from "@/types/api";
import { DEFAULT_BLOG_VALUES } from "@/constants/blogConstants";

interface UseBlogFormOptions {
  mode: "create" | "edit";
  blogId?: string;
  initialData?: Partial<BlogFormData>;
  draftKey?: string;
}

export function useBlogForm({
  mode,
  blogId,
  initialData,
  draftKey = "blog-draft",
}: UseBlogFormOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize form
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || DEFAULT_BLOG_VALUES,
  });

  // Draft management
  const { clearDraft, isLoading: isDraftLoading } = useDraft<BlogFormData>(
    form,
    `${draftKey}-${mode}`
  );

  // Submit handler
  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      const res =
        mode === "create"
          ? await createBlog(data)
          : await updateBlog(blogId!, data);

      toast({
        variant: "default",
        title: "Success",
        description: res.message,
      });

      // Invalidate queries and wait for refetch
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["blogs"],
          refetchType: "all"
        }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        blogId ? queryClient.invalidateQueries({ queryKey: ["blog", blogId] }) : Promise.resolve(),
      ]);

      await clearDraft();
      router.push("/dashboard/blog");
      queryClient.refetchQueries({ queryKey: ["blogs"] });
    } catch (error: any) {
      if (error instanceof ApiError && error.fields) {
        error.fields.forEach((fieldError) => {
          form.setError(fieldError.field as keyof BlogFormData, {
            message: fieldError.message,
          });
        });
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "An error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form with new data (memoized to prevent unnecessary re-renders)
  const resetForm = useCallback(
    (data: Partial<BlogFormData>) => {
      form.reset({
        ...DEFAULT_BLOG_VALUES,
        ...data,
      });
    },
    [form]
  );

  return {
    form,
    isLoading,
    isDraftLoading,
    onSubmit,
    resetForm,
    clearDraft,
  };
}