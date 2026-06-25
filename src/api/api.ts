import axios from "axios";
import { authStorage } from "../services/authStorage";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:8080",

  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    console.error("Erro da API:", {
      status,
      requestUrl,
      response: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default api;