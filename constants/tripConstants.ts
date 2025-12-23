export const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "NPR", label: "NPR - Nepalese Rupee" },
  { value: "INR", label: "INR - Indian Rupee" },
] as const;

export const CURRENCY_SHORT = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "JPY", label: "JPY" },
  { value: "NPR", label: "NPR" },
  { value: "INR", label: "INR" },
] as const;

export const ROUTE_GRADES = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "challenging", label: "Challenging" },
  { value: "difficult", label: "Difficult" },
  { value: "extreme", label: "Extreme" },
] as const;

export const TRIP_STYLES = [
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "leisure", label: "Leisure" },
  { value: "trekking", label: "Trekking" },
  { value: "tour", label: "Tour" },
  { value: "expedition", label: "Expedition" },
  { value: "safari", label: "Safari" },
] as const;

export const SEASONS = [
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
  { value: "all-year", label: "All Year" },
] as const;

export const MEAL_OPTIONS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
] as const;

export const TRIP_STATUS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
] as const;

export const DATE_PRICE_STATUS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "sold-out", label: "Sold Out" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const QUILL_MODULES_FULL = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export const QUILL_MODULES_BASIC = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

export const DEFAULT_TRIP_VALUES = {
  title: "",
  slug: "",
  tourLocations: "",
  overview: "",
  category: [],
  tags: [],
  featuredImage: "",
  status: "draft" as const,
  tripInfo: {
    duration: "",
    durationDays: 1,
    routeGrade: "",
    tripStyle: "",
    startingCity: "",
    endingCity: "",
    maxGroupSize: 1,
    minAge: 0,
    bestSeason: [],
  },
  basePrice: 0,
  currency: "USD",
  datesPrices: [],
  costIncludes: [],
  costExcludes: [],
  itinerary: {
    days: [{
      day: 1,
      title: "",
      description: "",
      activities: [],
      meals: [],
      accommodation: "",
    }],
  },
  tripPreparations: [],
  tripGallery: {
    images: [],
  },
  featured: false,
};