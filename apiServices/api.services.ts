const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;
const api = {
  auth: {
    login: "users/login",
    list: "users",
  },
  users: {
    list: "users",
  },
  media:{
    list:"media",
    upload:"media/create",
    delete:"media/delete"
  },
  blogs:{
   list:"blogs",
   create:"blogs",
   getBlogById:"blogs/{id}",
   update:"blogs/{id}",
   delete:"blogs/{id}",
  },
  dashboard: {
    stats: "dashboard/stats",
    analytics: "dashboard/analytics",
  },
  orders: {
    list: "orders",
    create: "orders",
    update: "orders",
    delete: "orders",
  },
};

export default api