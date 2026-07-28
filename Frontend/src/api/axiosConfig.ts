import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { getToken, removeTokens } from "../utils/tokenUtils";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeTokens();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
