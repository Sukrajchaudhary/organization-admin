"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, Trash, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TripFormData } from "@/formschema/tripSchema";
import ImageSelectModal from "@/components/media/ImageSelectModal";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import ReactSelect from "@/components/ui/secect";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-muted animate-pulse rounded-md" />,
});
import { FormSection } from "./FormSection";
import { DatesPricesFields } from "./DatesPricesFields";
import { CostSectionFields } from "./CostSectionFields";
import { ItineraryDayFields } from "./ItineraryDayFields";
import { FAQFields } from "./FAQFields";
import {
  CURRENCIES,
  ROUTE_GRADES,
  TRIP_STYLES,
  SEASONS,
  TRIP_STATUS,
  QUILL_MODULES_FULL,
} from "@/constants/tripConstants";

interface TripFormProps {
  form: UseFormReturn<TripFormData>;
  onSubmit: (data: TripFormData) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
  cancelHref: string;
}

export const TripForm = ({
  form,
  onSubmit,
  isLoading,
  submitButtonText,
  cancelHref,
}: TripFormProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSelectionMode, setImageSelectionMode] = useState<"featured" | "gallery">("featured");

  const handleImageSelect = (imageUrl: string) => {
    if (imageSelectionMode === "featured") {
      form.setValue("featuredImage", imageUrl);
    } else {
      const currentImages = form.getValues("tripGallery.images") || [];
      form.setValue("tripGallery.images", [...currentImages, imageUrl]);
    }
  };

  const addDatePrice = () => {
    const currentDates = form.getValues("datesPrices") || [];
    form.setValue("datesPrices", [
      ...currentDates,
      {
        startDate: "",
        endDate: "",
        price: 0,
        currency: "USD",
        availableSeats: 0,
        status: "published",
        earlyBirdDiscount: 0,
      },
    ]);
  };

  const removeDatePrice = (index: number) => {
    const currentDates = form.getValues("datesPrices") || [];
    form.setValue("datesPrices", currentDates.filter((_, i) => i !== index));
  };

  const addCostSection = (fieldName: "costIncludes" | "costExcludes") => {
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...current, { title: "", items: [] }]);
  };

  const removeCostSection = (fieldName: "costIncludes" | "costExcludes", index: number) => {
    const current = form.getValues(fieldName) || [];
    form.setValue(fieldName, current.filter((_, i) => i !== index));
  };

  const addItineraryDay = () => {
    const currentDays = form.getValues("itinerary.days") || [];
    form.setValue("itinerary.days", [
      ...currentDays,
      {
        day: currentDays.length + 1,
        title: "",
        description: "",
        activities: [],
        meals: [],
        accommodation: "",
      },
    ]);
  };

  const removeItineraryDay = (index: number) => {
    const currentDays = form.getValues("itinerary.days") || [];
    form.setValue("itinerary.days", currentDays.filter((_, i) => i !== index));
  };

  const addFAQ = () => {
    const current = form.getValues("tripPreparations") || [];
    form.setValue("tripPreparations", [...current, { question: "", answer: "" }]);
  };

  const removeFAQ = (index: number) => {
    const current = form.getValues("tripPreparations") || [];
    form.setValue("tripPreparations", current.filter((_, i) => i !== index));
  };

  const removeGalleryImage = (index: number) => {
    const currentImages = form.getValues("tripGallery.images") || [];
    form.setValue("tripGallery.images", currentImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <Card className="bg-card rounded-sm border-border">
        <CardHeader className="hidden">
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter trip title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter trip slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tourLocations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tour Locations</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tour locations" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <ReactSelect
                          url="categories"
                          isMulti={true}
                          form={form}
                          name="category"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overview</FormLabel>
                    <FormControl>
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter trip overview"
                        style={{ minHeight: "200px" }}
                        modules={QUILL_MODULES_FULL}
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
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags separated by commas"
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
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRIP_STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
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
                name="featuredImage"
                render={({ field }) => (
                  <FormItem className="max-w-[200px]">
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value && (
                          <div className="relative">
                            <Image
                              src={field.value}
                              alt="Selected image"
                              height={300}
                              width={300}
                              className="w-full max-w-sm h-48 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute rounded-full top-2 right-2"
                              onClick={() => field.onChange("")}
                            >
                              <Trash />
                            </Button>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImageSelectionMode("featured");
                            setModalOpen(true);
                          }}
                          className="w-full bg-primary-green text-white hover:bg-primary-green"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          {field.value ? "Change Image" : "Select Image"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormSection title="Trip Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tripInfo.duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 Days 4 Nights" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tripInfo.durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration Days</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter duration in days"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tripInfo.routeGrade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Grade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select route grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            {ROUTE_GRADES.map((grade) => (
                              <SelectItem key={grade.value} value={grade.value}>
                                {grade.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tripInfo.tripStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Style</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select trip style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            {TRIP_STYLES.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tripInfo.startingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter starting city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tripInfo.endingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ending City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ending city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tripInfo.maxGroupSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Group Size</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter max group size"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tripInfo.minAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter minimum age"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tripInfo.bestSeason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Best Season</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange([value])}
                        value={field.value?.[0] || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select best season" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SEASONS.map((season) => (
                            <SelectItem key={season.value} value={season.value}>
                              {season.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection title="Pricing">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter base price"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection
                title="Dates & Prices"
                onAdd={addDatePrice}
                addButtonText="Add Date"
              >
                {form.watch("datesPrices")?.map((_, index) => (
                  <DatesPricesFields
                    key={index}
                    form={form}
                    index={index}
                    onRemove={() => removeDatePrice(index)}
                  />
                ))}
              </FormSection>

              <FormSection
                title="Cost Includes"
                onAdd={() => addCostSection("costIncludes")}
                addButtonText="Add Section"
              >
                {form.watch("costIncludes")?.map((_, sectionIndex) => (
                  <CostSectionFields
                    key={sectionIndex}
                    form={form}
                    sectionIndex={sectionIndex}
                    fieldName="costIncludes"
                    onRemove={() => removeCostSection("costIncludes", sectionIndex)}
                  />
                ))}
              </FormSection>

              <FormSection
                title="Cost Excludes"
                onAdd={() => addCostSection("costExcludes")}
                addButtonText="Add Section"
              >
                {form.watch("costExcludes")?.map((_, sectionIndex) => (
                  <CostSectionFields
                    key={sectionIndex}
                    form={form}
                    sectionIndex={sectionIndex}
                    fieldName="costExcludes"
                    onRemove={() => removeCostSection("costExcludes", sectionIndex)}
                  />
                ))}
              </FormSection>

              <FormSection
                title="Itinerary"
                onAdd={addItineraryDay}
                addButtonText="Add Day"
              >
                {form.watch("itinerary.days")?.map((_, dayIndex) => (
                  <ItineraryDayFields
                    key={dayIndex}
                    form={form}
                    dayIndex={dayIndex}
                    onRemove={() => removeItineraryDay(dayIndex)}
                  />
                ))}
              </FormSection>

              <FormSection
                title="Trip Preparations (FAQs)"
                onAdd={addFAQ}
                addButtonText="Add FAQ"
              >
                {form.watch("tripPreparations")?.map((_, index) => (
                  <FAQFields
                    key={index}
                    form={form}
                    index={index}
                    onRemove={() => removeFAQ(index)}
                  />
                ))}
              </FormSection>

              <FormSection
                title="Trip Gallery"
                onAdd={() => {
                  setImageSelectionMode("gallery");
                  setModalOpen(true);
                }}
                addButtonText="Add Image"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {form.watch("tripGallery.images")?.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </FormSection>

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Mark as featured trip
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary-green text-white hover:bg-primary-green"
                >
                  {isLoading ? `${submitButtonText}...` : submitButtonText}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => window.location.href = cancelHref}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ImageSelectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};