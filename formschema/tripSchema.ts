import { z } from "zod";

export const tripSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  tourLocations: z.string().min(1, "Tour locations are required"),
  overview: z.string().min(1, "Overview is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  status: z.enum(["published", "draft"], {
    errorMap: () => ({ message: "Status must be either 'published' or 'draft'" }),
  }),
  tripInfo: z.object({
    duration: z.string().min(1, "Duration is required"),
    durationDays: z.number().min(1, "Duration days must be at least 1"),
    routeGrade: z.string().min(1, "Route grade is required"),
    tripStyle: z.string().min(1, "Trip style is required"),
    startingCity: z.string().min(1, "Starting city is required"),
    endingCity: z.string().min(1, "Ending city is required"),
    maxGroupSize: z.number().min(1, "Max group size must be at least 1"),
    minAge: z.number().min(0, "Min age cannot be negative"),
    bestSeason: z.array(z.string()).min(1, "At least one best season is required"),
  }),
  basePrice: z.number().min(0, "Base price cannot be negative"),
  currency: z.string().min(1, "Currency is required"),
  datesPrices: z.array(z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    price: z.number().min(0, "Price cannot be negative"),
    currency: z.string().min(1, "Currency is required"),
    availableSeats: z.number().min(0, "Available seats cannot be negative"),
    status: z.string().min(1, "Status is required"),
    earlyBirdDiscount: z.number().min(0, "Early bird discount cannot be negative"),
  })).optional(),
  costIncludes: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    items: z.array(z.object({
      title: z.string().min(1, "Item title is required"),
      answer: z.string().min(1, "Item answer is required"),
    })),
  })).optional(),
  costExcludes: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    items: z.array(z.object({
      title: z.string().min(1, "Item title is required"),
      answer: z.string().min(1, "Item answer is required"),
    })),
  })).optional(),
  itinerary: z.object({
    days: z.array(z.object({
      day: z.number().min(1, "Day must be at least 1"),
      title: z.string().min(1, "Day title is required"),
      description: z.string().min(1, "Day description is required"),
      activities: z.array(z.string()),
      meals: z.array(z.string()),
      accommodation: z.string(),
    })),
  }),
  tripPreparations: z.array(z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
  })).optional(),
  tripGallery: z.object({
    images: z.array(z.string()),
  }),
  featured: z.boolean().optional(),
});

export type TripFormData = z.infer<typeof tripSchema>;