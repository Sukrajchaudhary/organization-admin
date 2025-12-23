export interface Trip {
  _id: string;
  title: string;
  slug: string;
  tourLocations: string;
  overview: string;
  category: string[];
  tags: string[];
  featuredImage: string;
  status: string;
  tripInfo: TripInfo;
  basePrice: number;
  currency: string;
  datesPrices: TripDatesPrices[];
  costIncludes: TripCostIncludes[];
  costExcludes: TripCostExcludes[];
  itinerary: TripItinerary;
  tripPreparations: TripPreparations[];
  tripGallery: TripGallery;
  reviews: TripReviews[];
  viewCount: number;
  featured: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripInfo {
  duration: string;
  durationDays: number;
  routeGrade: string;
  tripStyle: string;
  startingCity: string;
  endingCity: string;
  maxGroupSize: number;
  minAge: number;
  bestSeason: string[];
}

export interface TripDatesPrices {
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  availableSeats: number;
  status: string;
  earlyBirdDiscount: number;
}

export interface TripCostIncludes {
  title: string;
  items: TripCostIncludesItems[];
}

export interface TripCostIncludesItems {
  title: string;
  answer: string;
}

export interface TripCostExcludes {
  title: string;
  items: TripCostExcludesItems[];
}

export interface TripCostExcludesItems {
  title: string;
  answer: string;
}

export interface TripItinerary {
  days: TripItineraryDays[];
}

export interface TripItineraryDays {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

export interface TripPreparations {
  question: string;
  answer: string;
}

export interface TripGallery {
  images: string[];
}

export interface TripReviews {
  customerId: string;
  customerName: string;
  reviewDate: string;
  reviewText: string;
  rating: number;
  verified: boolean;
}