export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: {
      admin: number;
      manager: number;
      user: number;
    };
  };
  queries: {
    total: number;
    pending: number;
    resolved: number;
    ignored: number;
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
    totalLikes: number;
  };
  categories: {
    total: number;
    active: number;
    inactive: number;
  };
  paidAccounts: {
    total: number;
  };
  trialAccounts: {
    total: number;
    active: number;
    expired: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface MonthlyRegistration {
  month: number;
  monthName: string;
  count: number;
}

export interface MonthlyRegistrationsResponse {
  year: number;
  registrations: MonthlyRegistration[];
}

export interface YearlyRegistration {
  year: number;
  count: number;
}

export interface YearlyRegistrationsResponse {
  registrations: YearlyRegistration[];
}

export interface RegistrationDataPoint {
  date: string;
  count: number;
}

export interface DateRangeRegistrationsResponse {
  total: number;
  data: RegistrationDataPoint[];
}