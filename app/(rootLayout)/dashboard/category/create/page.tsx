"use client";
import CategoryForm from "@/components/category/CategoryForm";
import { useCategoryForm } from "@/hooks/useCategoryForm";

export default function CreateCategoryPage() {
  const { form, isLoading, onSubmit } = useCategoryForm({
    mode: "create",
    draftKey: "create-category",
  });

  return (
    <CategoryForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode="create"
      showBackButton={false}
    />
  );
}