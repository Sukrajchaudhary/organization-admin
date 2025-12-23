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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { QUILL_MODULES_BASIC } from "@/constants/tripConstants";

interface FAQFieldsProps {
  form: UseFormReturn<TripFormData>;
  index: number;
  onRemove: () => void;
}

export const FAQFields = ({ form, index, onRemove }: FAQFieldsProps) => {
  return (
    <div className="p-4 border rounded-lg space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">FAQ {index + 1}</h4>
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
        name={`tripPreparations.${index}.question`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
              <Input placeholder="e.g., What should I pack?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`tripPreparations.${index}.answer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Answer</FormLabel>
            <FormControl>
              <ReactQuill
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter answer"
                style={{ minHeight: "140px" }}
                modules={QUILL_MODULES_BASIC}
                theme="snow"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};