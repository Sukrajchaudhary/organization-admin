const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;
const api = {
  auth: {
    login: "users/login",
    list: "users",
  },
  users: {
    list: "users/getUsers",
    deactive:"users/{id}/deactivate",
    active:"users/{id}/active",
    block:"users/{userId}/block",
    unblock:"users/{userId}/unblock",
    upgrade:"users/{id}/upgrade" ,//put method
    paid:"users/{id}/make-paid",
    revokePaid:"users/{id}/revoke-paid"
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
   getCategoryById:"categories/{id}",
   create:"categories/create",
   update:"categories/update/{id}",
   delete:"categories/delete/{id}"
  },
  dashboard: {
    stats: "dashboard/stats",
    analytics: "dashboard/analytics",
    registrationsMonthly: "dashboard/registrations/monthly",
    registrationsYearly: "dashboard/registrations/yearly",
    registrationsRange: "dashboard/registrations/range",
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
    list:"notifications/me",
    // list:"notifications",
    markAllread:"notifications/me/read-all"
  },
  trip:{
    list:"trips",
    create:"trips",
    getByid:"trips/{id}"
  }
};

export default api