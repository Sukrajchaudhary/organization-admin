import { z } from "zod";

export const querySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["new", "pending", "in-progress", "resolved"], {
    errorMap: () => ({ message: "Status must be 'new', 'pending', 'in-progress', or 'resolved'" }),
  }).optional().default("new"),
});

export type QueryFormData = z.infer<typeof querySchema>;
