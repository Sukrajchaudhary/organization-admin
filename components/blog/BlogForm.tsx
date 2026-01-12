"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { BlogFormData } from "@/formschema/blogSchemas";
import ImageSelectModal from "@/components/media/ImageSelectModal";
import Image from "next/image";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ReactSelect from "@/components/ui/secect";

// Quill toolbar configuration
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

interface BlogFormProps {
  form: UseFormReturn<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
  showBackButton?: boolean;
}

export function BlogForm({
  form,
  onSubmit,
  isLoading,
  mode,
  showBackButton = true,
}: BlogFormProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    form.setValue("image", imageUrl);
  };

  const isCreate = mode === "create";
  const submitText = isCreate ? "Create Blog" : "Update Blog";
  const loadingText = isCreate ? "Creating..." : "Updating...";
  const headerTitle = isCreate ? "Create New Blog" : "Edit Blog";
  const headerDescription = isCreate
    ? "Add a new blog post to your collection."
    : "Update the blog post details.";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Link href="/dashboard/blog">
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
          <CardTitle>Blog Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description - Rich Text */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter blog description"
                        style={{ minHeight: "200px" }}
                        modules={QUILL_MODULES}
                        theme="snow"
                      />
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
                  <FormItem className="mt-16">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categories */}
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <ReactSelect
                        url="categories"
                        isMulti={true}
                        form={form}
                        name="categories"
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

              {/* Read Time */}
              <FormField
                control={form.control}
                name="readTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter read time"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Draft Toggle */}
              <FormField
                control={form.control}
                name="draft"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Draft</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Mark as draft if not ready to publish
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
                <Link href="/dashboard/blog">
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

export default BlogForm;