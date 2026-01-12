import { BlogFormData } from "@/formschema/blogSchemas";

export const DEFAULT_BLOG_VALUES: BlogFormData = {
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
};

export const BLOG_STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
] as const;