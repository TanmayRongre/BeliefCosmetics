import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "";
const cleanUrl = rawUrl.replace(/\/+$/, "");

const BASE_URL = import.meta.env.MODE === "development" && !rawUrl
  ? "http://localhost:5000/api"
  : `${cleanUrl}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach token header for cross-domain deployments where third-party cookies are blocked
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
