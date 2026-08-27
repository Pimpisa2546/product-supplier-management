import { message } from "antd";
import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  baseURL: import.meta.env.VITE_API_URL || "https://product-supplier-management.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginPage = window.location.pathname === "/" || window.location.pathname === "/login";

      if (!isLoginPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        message.error("Session expired. Please log in again.");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;