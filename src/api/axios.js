import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL?.trim() ||
    "https://staffmanagement-backend-mt9g.onrender.com/api",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Trigger a custom event to notify AuthContext
      window.dispatchEvent(new Event("logout"));
      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
    return Promise.reject(error);
  },
);

export default api;
