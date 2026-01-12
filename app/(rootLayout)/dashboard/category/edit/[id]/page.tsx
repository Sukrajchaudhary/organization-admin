"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "@/apiServices/category/api.categoryServices";
import CategoryForm from "@/components/category/CategoryForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryForm } from "@/hooks/useCategoryForm";

function CategoryEditSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>
      <div className="bg-card rounded-sm p-6 border-border space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  // Fetch category data
  const { data: categoryData, isLoading: isFetching } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const response = await getCategoryById(categoryId);
      return response.data;
    },
    enabled: !!categoryId,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Initialize form with hook
  const { form, isLoading, onSubmit, resetForm } = useCategoryForm({
    mode: "edit",
    categoryId,
    draftKey: `edit-category-${categoryId}`,
  });

  // Reset form when category data is loaded
  useEffect(() => {
    if (categoryData) {
      resetForm({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        isActive: categoryData.isActive,
        sortOrder: categoryData.sortOrder,
        image: categoryData.image || "",
        meta: {
          title: categoryData.meta?.title || "",
          description: categoryData.meta?.description || "",
          keywords: categoryData.meta?.keywords || [],
        },
      });
    }
  }, [categoryData, resetForm]);

  if (isFetching) {
    return <CategoryEditSkeleton />;
  }

  if (!categoryData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <CategoryForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode="edit"
      showBackButton={true}
    />
  );
}