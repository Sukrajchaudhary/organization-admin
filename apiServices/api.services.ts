const baseUrl = process.env.NEXT_BASE_SERVER_URL;
const api = {
  auth: {
    login: "users/login",
    list: "users",
  },
};

export default api