import { z } from "zod";
export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().url("Invalid image URL"),
  categories: z.array(z.string()).optional(),
  readTime: z.number().min(1, "Read time must be at least 1 minute"),
  status: z.enum(["published", "draft"], {
    errorMap: () => ({ message: "Status must be either 'published' or 'draft'" }),
  }),
  draft: z.boolean(),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export type BlogFormData = z.infer<typeof blogSchema>;