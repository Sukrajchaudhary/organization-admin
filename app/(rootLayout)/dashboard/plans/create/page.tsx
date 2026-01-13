"use client";

import PlanForm from "@/components/plans/PlanForm";
import { usePlanForm } from "@/hooks/usePlanForm";

export default function CreatePlanPage() {
  const { form, isLoading, onSubmit } = usePlanForm({
    mode: "create",
    draftKey: "create-plan",
  });

  return (
    <PlanForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode="create"
      showBackButton={false}
    />
  );
}