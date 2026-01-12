"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageIcon, Trash, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CategoryFormData } from "@/formschema/categorySchema";
import ImageSelectModal from "@/components/media/ImageSelectModal";
import Image from "next/image";

interface CategoryFormProps {
  form: UseFormReturn<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
  showBackButton?: boolean;
}

export function CategoryForm({
  form,
  onSubmit,
  isLoading,
  mode,
  showBackButton = true,
}: CategoryFormProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    form.setValue("image", imageUrl);
  };

  const isCreate = mode === "create";
  const submitText = isCreate ? "Create Category" : "Update Category";
  const loadingText = isCreate ? "Creating..." : "Updating...";
  const headerTitle = isCreate ? "Create New Category" : "Edit Category";
  const headerDescription = isCreate
    ? "Add a new category to your collection."
    : "Update the category details.";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Link href="/dashboard/category">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-xl font-bold">{headerTitle}</h1>
          <p className="text-muted-foreground text-sm mt-1">{headerDescription}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-card rounded-sm p-6 border-border">
        <CardHeader className="hidden">
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="max-w-[200px]">
                    <FormLabel>Image</FormLabel>
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
                          onClick={() => setModalOpen(true)}
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

              {/* Sort Order */}
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter sort order"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Enable or disable this category
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Meta Information Section */}
              <div className="space-y-4 bg-muted/50 p-6 rounded-sm">
                <h3 className="text-2xl font-semibold">Meta Information</h3>

                <FormField
                  control={form.control}
                  name="meta.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter meta title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter meta description" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter keywords separated by commas"
                          value={field.value?.join(", ") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split(",")
                                .map((k) => k.trim())
                                .filter((k) => k)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary-green text-white hover:bg-primary-green"
                >
                  {isLoading ? loadingText : submitText}
                </Button>
                <Link href="/dashboard/category">
                  <Button variant="outline" type="button" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Image Select Modal */}
      <ImageSelectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
}

export default CategoryForm;