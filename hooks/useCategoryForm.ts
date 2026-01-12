"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { categorySchema, CategoryFormData } from "@/formschema/categorySchema";
import { createCategory, updateCategory } from "@/apiServices/category/api.categoryServices";
import { useToast } from "@/hooks/use-toast";
import { useDraft } from "@/hooks/useDraft";
import { ApiError } from "@/types/api";
import { DEFAULT_CATEGORY_VALUES } from "@/constants/categoryConstants";

interface UseCategoryFormOptions {
  mode: "create" | "edit";
  categoryId?: string;
  initialData?: Partial<CategoryFormData>;
  draftKey?: string;
}

export function useCategoryForm({
  mode,
  categoryId,
  initialData,
  draftKey = "category-draft",
}: UseCategoryFormOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize form
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || DEFAULT_CATEGORY_VALUES,
  });

  // Draft management
  const { clearDraft, isLoading: isDraftLoading } = useDraft<CategoryFormData>(
    form,
    `${draftKey}-${mode}`
  );

  // Submit handler
  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      const res =
        mode === "create"
          ? await createCategory(data)
          : await updateCategory(categoryId!, data);

      toast({
        variant: "default",
        title: "Success",
        description: res.message,
      });

      // Invalidate queries and wait for refetch
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
          refetchType: "all"
        }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        categoryId ? queryClient.invalidateQueries({ queryKey: ["category", categoryId] }) : Promise.resolve(),
      ]);

      await clearDraft();
      router.push("/dashboard/category");
      queryClient.refetchQueries({ queryKey: ["categories"] });
    } catch (error: any) {
      if (error instanceof ApiError && error.fields) {
        error.fields.forEach((fieldError) => {
          form.setError(fieldError.field as keyof CategoryFormData, {
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
    (data: Partial<CategoryFormData>) => {
      form.reset({
        ...DEFAULT_CATEGORY_VALUES,
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