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
}