import axios from "axios";

/**
 * Centralized Axios instance.
 *
 * - baseURL  → "/api"  (Vite proxy forwards to http://localhost:5000/api)
 * - Request interceptor automatically attaches JWT Bearer token from localStorage
 * - Response interceptor handles 401 (token expired) gracefully
 */
const rawApiUrl = import.meta.env.VITE_API_URL || "/api";
const baseApiUrl = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

const apiClient = axios.create({
  baseURL: baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("userId");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
