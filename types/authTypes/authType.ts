export interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  mobileNumber: string;
  accountType: string;
  companyLocations: string[];
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  trialStartDate: string;
  trialEndDate: string;
  isTrialActive: boolean;
  isBlocked: boolean;
  isPremium: boolean;
  rating: number;
  totalRatings: number;
  portfolio: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TrialInfo {
  isTrialActive: boolean;
  daysRemaining: number;
}