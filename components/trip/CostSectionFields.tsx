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
import { X, Plus } from "lucide-react";

interface CostSectionFieldsProps {
  form: UseFormReturn<TripFormData>;
  sectionIndex: number;
  fieldName: "costIncludes" | "costExcludes";
  onRemove: () => void;
}

export const CostSectionFields = ({
  form,
  sectionIndex,
  fieldName,
  onRemove
}: CostSectionFieldsProps) => {
  const handleAddItem = () => {
    const currentItems = form.getValues(`${fieldName}.${sectionIndex}.items`) || [];
    form.setValue(`${fieldName}.${sectionIndex}.items`, [
      ...currentItems,
      { title: "", answer: "" },
    ]);
  };

  const handleRemoveItem = (itemIndex: number) => {
    const currentItems = form.getValues(`${fieldName}.${sectionIndex}.items`) || [];
    form.setValue(
      `${fieldName}.${sectionIndex}.items`,
      currentItems.filter((_, i) => i !== itemIndex)
    );
  };

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Section {sectionIndex + 1}</h4>
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
        name={`${fieldName}.${sectionIndex}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section Title</FormLabel>
            <FormControl>
              <Input
                placeholder={`e.g., ${fieldName === "costIncludes" ? "Accommodation" : "Personal Expenses"}`}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>Items</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        </div>

        {form.watch(`${fieldName}.${sectionIndex}.items`)?.map((_, itemIndex) => (
          <div key={itemIndex} className="flex gap-2 items-start">
            <FormField
              control={form.control}
              name={`${fieldName}.${sectionIndex}.items.${itemIndex}.title`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Item title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`${fieldName}.${sectionIndex}.items.${itemIndex}.answer`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Item description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(itemIndex)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};