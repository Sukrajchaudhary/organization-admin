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
  comments: {
    total: number;
  };
  testimonials: {
    total: number;
  };
  banners: {
    total: number;
  };
  notifications: {
    total: number;
    unread: number;
    read: number;
  };
}