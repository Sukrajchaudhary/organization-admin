"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { planSchema, PlanFormData } from "@/formschema/planSchema";
import { createPlan, updatePlan } from "@/apiServices/plans/api.plansServices";
import { useToast } from "@/hooks/use-toast";
import { useDraft } from "@/hooks/useDraft";
import { ApiError } from "@/types/api";
import { DEFAULT_PLAN_VALUES } from "@/constants/planConstants";

interface UsePlanFormOptions {
  mode: "create" | "edit";
  planId?: string;
  initialData?: Partial<PlanFormData>;
  draftKey?: string;
}

export function usePlanForm({
  mode,
  planId,
  initialData,
  draftKey = "plan-draft",
}: UsePlanFormOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize form
  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: initialData || DEFAULT_PLAN_VALUES,
  });

  // Draft management
  const { clearDraft, isLoading: isDraftLoading } = useDraft<PlanFormData>(
    form,
    `${draftKey}-${mode}`
  );

  // Submit handler
  const onSubmit = async (data: PlanFormData) => {
    setIsLoading(true);
    try {
      // Clean up empty date strings
      const cleanedData = {
        ...data,
        offerStartTime: data.offerStartTime || undefined,
        offerEndTime: data.offerEndTime || undefined,
        startFrom: data.startFrom || undefined,
        startTo: data.startTo || undefined,
      };

      const res =
        mode === "create"
          ? await createPlan(cleanedData as any)
          : await updatePlan(planId!, cleanedData as any);

      toast({
        variant: "default",
        title: "Success",
        description: res.message || `Plan ${mode === "create" ? "created" : "updated"} successfully`,
      });

      // Invalidate queries and wait for refetch
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: ["plans"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }),
        planId
          ? queryClient.invalidateQueries({ queryKey: ["plan", planId] })
          : Promise.resolve(),
      ]);

      await clearDraft();
      router.push("/dashboard/plans");
      queryClient.refetchQueries({ queryKey: ["plans"] });
    } catch (error: any) {
      if (error instanceof ApiError && error.fields) {
        error.fields.forEach((fieldError) => {
          form.setError(fieldError.field as keyof PlanFormData, {
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
    (data: Partial<PlanFormData>) => {
      form.reset({
        ...DEFAULT_PLAN_VALUES,
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