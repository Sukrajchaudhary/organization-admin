"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPlanById } from "@/apiServices/plans/api.plansServices";
import PlanForm from "@/components/plans/PlanForm";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlanForm } from "@/hooks/usePlanForm";

function PlanEditSkeleton() {
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
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export default function EditPlanPage() {
  const params = useParams();
  const planId = params.id as string;

  // Fetch plan data
  const { data: planData, isLoading: isFetching } = useQuery({
    queryKey: ["plan", planId],
    queryFn: async () => {
      const response = await getPlanById(planId);
      return response.data;
    },
    enabled: !!planId,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Initialize form with hook
  const { form, isLoading, onSubmit, resetForm } = usePlanForm({
    mode: "edit",
    planId,
    draftKey: `edit-plan-${planId}`,
  });

  // Reset form when plan data is loaded
  useEffect(() => {
    if (planData) {
      resetForm({
        name: planData.name,
        type: planData.type,
        price: planData.price,
        currency: planData.currency || "USD",
        description: planData.description || "",
        options: planData.options || [],
        offerStartTime: planData.offerStartTime
          ? new Date(planData.offerStartTime).toISOString().slice(0, 16)
          : "",
        offerEndTime: planData.offerEndTime
          ? new Date(planData.offerEndTime).toISOString().slice(0, 16)
          : "",
        startFrom: planData.startFrom
          ? new Date(planData.startFrom).toISOString().slice(0, 16)
          : "",
        startTo: planData.startTo
          ? new Date(planData.startTo).toISOString().slice(0, 16)
          : "",
        discountPercentage: planData.discountPercentage || 0,
        isActive: planData.isActive,
      });
    }
  }, [planData, resetForm]);

  if (isFetching) {
    return <PlanEditSkeleton />;
  }

  if (!planData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Plan not found</p>
      </div>
    );
  }

  return (
    <PlanForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode="edit"
      showBackButton={true}
    />
  );
}