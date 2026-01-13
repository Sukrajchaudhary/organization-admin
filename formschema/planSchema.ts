import { z } from "zod";

const planOptionSchema = z.object({
  title: z.string().min(1, "Option title is required"),
  description: z.string().optional(),
  included: z.boolean().default(true),
});

export const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  type: z.enum(["monthly", "yearly", "lifetime"], {
    required_error: "Plan type is required",
  }),
  price: z.number().min(0, "Price must be 0 or greater"),
  currency: z.string().default("USD"),
  description: z.string().optional(),
  options: z.array(planOptionSchema).default([]),
  offerStartTime: z.string().optional().or(z.literal("")),
  offerEndTime: z.string().optional().or(z.literal("")),
  startFrom: z.string().optional().or(z.literal("")),
  startTo: z.string().optional().or(z.literal("")),
  discountPercentage: z.number().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
});

export type PlanFormData = z.infer<typeof planSchema>;
export type PlanOptionFormData = z.infer<typeof planOptionSchema>;