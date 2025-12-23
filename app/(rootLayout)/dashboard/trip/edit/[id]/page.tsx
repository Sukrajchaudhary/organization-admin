"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, TripFormData } from "@/formschema/tripSchema";
import { updateTrip, getTripById } from "@/apiServices/trip/api.tripServices";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";
import { TripForm } from "@/components/trip/TripForm";
import { DEFAULT_TRIP_VALUES } from "@/constants/tripConstants";

export default function EditTripPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: DEFAULT_TRIP_VALUES,
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const trip = await getTripById(id);
        form.reset(trip as unknown as TripFormData);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to fetch trip: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchTrip();
    }
  }, [id, form, toast]);

  const onSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    try {
      const res = await updateTrip(id, data);
      toast({
        variant: "default",
        title: "Success",
        description: `${res.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["trips"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
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


  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">Edit Trip</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update the trip details.
          </p>
        </div>
      </div>

      <TripForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText="Update Trip"
        cancelHref="/dashboard/trip"
      />
    </div>
  );
}