import { UseFormReturn } from "react-hook-form";
import { TripFormData } from "@/formschema/tripSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { MEAL_OPTIONS, QUILL_MODULES_BASIC } from "@/constants/tripConstants";

interface ItineraryDayFieldsProps {
  form: UseFormReturn<TripFormData>;
  dayIndex: number;
  onRemove: () => void;
}

export const ItineraryDayFields = ({ form, dayIndex, onRemove }: ItineraryDayFieldsProps) => {
  return (
    <div className="p-4 border rounded-lg space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Day {dayIndex + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <FormField
        control={form.control}
        name={`itinerary.days.${dayIndex}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Day Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Arrival in Tokyo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`itinerary.days.${dayIndex}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <ReactQuill
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter day description"
                style={{ minHeight: "150px" }}
                modules={QUILL_MODULES_BASIC}
                theme="snow"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 mt-15 gap-4">
        <FormField
          control={form.control}
          name={`itinerary.days.${dayIndex}.activities`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activities</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter activities separated by commas"
                  value={field.value?.join(", ") || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`itinerary.days.${dayIndex}.meals`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meals</FormLabel>
              <Select
                onValueChange={(value) => field.onChange([value])}
                value={field.value?.[0] || ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select meals" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MEAL_OPTIONS.map((meal) => (
                    <SelectItem key={meal.value} value={meal.value}>
                      {meal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={`itinerary.days.${dayIndex}.accommodation`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accommodation</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Hotel in Tokyo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};