import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
  sortOrder: z.number().min(0, "Sort order must be 0 or greater"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export type CategoryFormData = z.infer<typeof categorySchema>;