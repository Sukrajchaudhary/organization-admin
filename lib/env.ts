import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BASE_SERVER_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_BASE_SERVER_URL: process.env.NEXT_PUBLIC_BASE_SERVER_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
});
