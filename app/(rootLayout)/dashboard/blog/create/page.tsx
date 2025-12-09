"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ImageIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { blogSchema, BlogFormData } from "@/formschema/blogSchemas";
import ImageSelectModal from "@/components/media/ImageSelectModal";
import Image from "next/image";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createBlog } from "@/apiServices/blog/api.blogServices";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";
import ReactSelect from "@/components/ui/secect";
export default function CreateBlogPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      image: "",
      categories: [],
      readTime: 1,
      status: "draft",
      draft: true,
      meta: {
        title: "",
        description: "",
        keywords: [],
      },
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      const res = await createBlog(data);
      toast({
        variant: "default",
        title: "Success",
        description: `${res.message}`,
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/dashboard/blog");
    } catch (error: any) {
      if (error instanceof ApiError && error.fields) {
        error.fields.forEach((fieldError) => {
          form.setError(fieldError.field as keyof BlogFormData, {
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

  const handleImageSelect = (imageUrl: string) => {
    form.setValue("image", imageUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* <Link href="/dashboard/blog">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link> */}
        <div>
          <h1 className="text-xl font-bold">Create New Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Add a new blog post to your collection.
          </p>
        </div>
      </div>

      <Card className="bg-card rounded-sm p-6 border-border">
        <CardHeader className="hidden">
          <CardTitle>Blog Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link"],
                            ["clean"],
                          ],
                        }}
                        theme="snow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
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
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4 bg-gray-50 p-6 rounded-sm">
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
                        <Textarea
                          placeholder="Enter meta description"
                          rows={3}
                          {...field}
                        />
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
                          {...field}
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

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary-green text-white hover:bg-primary-green"
                >
                  {isLoading ? "Creating..." : "Create Blog"}
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

      <ImageSelectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
