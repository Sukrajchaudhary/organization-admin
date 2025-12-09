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
  categories:{
   list:"categories",
   create:"categories/create",
   update:"categories/update/{id}",
   delete:"categories/delete/{id}"
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
  queries: {
    list: "queries",
    create: "queries",
    getById: "queries/{id}",
    update: "queries/{id}",
    delete: "queries/{id}",
  },
  notifications:{
    list:"notifications"
  }
};

export default api