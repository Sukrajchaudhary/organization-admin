"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, TripFormData } from "@/formschema/tripSchema";
import { createTrip } from "@/apiServices/trip/api.tripServices";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";
import { useDraft } from "@/hooks/useDraft";
import { TripForm } from "@/components/trip/TripForm";
import { DEFAULT_TRIP_VALUES } from "@/constants/tripConstants";

export default function CreateTripPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: DEFAULT_TRIP_VALUES,
  });

  const { clearDraft } = useDraft<TripFormData>(form, "create-trip-draft");

  const onSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    try {
      const res = await createTrip(data);
      toast({
        variant: "default",
        title: "Success",
        description: `${res.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["trips"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      await clearDraft();
      router.push("/dashboard/trip");
    } catch (error: any) {
      if (error instanceof ApiError && error.fields) {
        error.fields.forEach((fieldError) => {
          form.setError(fieldError.field as keyof TripFormData, {
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
          description: `${error.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">Create New Trip</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Add a new trip to your collection.
          </p>
        </div>
      </div>

      <TripForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText="Create Trip"
        cancelHref="/dashboard/trip"
      />
    </div>
  );
}