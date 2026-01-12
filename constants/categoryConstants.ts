import { CategoryFormData } from "@/formschema/categorySchema";

export const DEFAULT_CATEGORY_VALUES: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
  sortOrder: 0,
  image: "",
  meta: {
    title: "",
    description: "",
    keywords: [],
  },
};

export const CATEGORY_STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
] as const;