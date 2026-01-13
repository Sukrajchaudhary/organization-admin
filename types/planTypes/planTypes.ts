export interface PlanOption {
  title: string;
  description?: string;
  included: boolean;
}

export interface RootPlanData {
  _id: string;
  name: string;
  type: "monthly" | "yearly" | "lifetime";
  price: number;
  currency: string;
  description?: string;
  options: PlanOption[];
  offerStartTime?: string;
  offerEndTime?: string;
  startFrom?: string;
  startTo?: string;
  discountPercentage?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface RootPlanPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface RootPlans {
  success: boolean;
  data: RootPlanData[];
  pagination: RootPlanPagination;
}

export type CreatePlanData = Omit<RootPlanData, "_id" | "createdAt" | "updatedAt" | "__v">;

// Legacy type aliases for backwards compatibility
export type Plan = RootPlanData;
export type PlanCreate = CreatePlanData;