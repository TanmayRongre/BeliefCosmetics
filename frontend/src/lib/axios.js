import axios from "axios";

const rawUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://beliefcosmetics-i4mb.onrender.com");
const cleanUrl = (rawUrl || "https://beliefcosmetics-i4mb.onrender.com").replace(
  /\/+$/,
  ""
);

const BASE_URL = `${cleanUrl}/api`;

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
