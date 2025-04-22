import axios from "axios";
import { useAuthStore } from "store/auth";

export const cmsAxios = axios.create({
  baseURL: import.meta.env.VITE_WEB_URL_API,
  withCredentials: true,
  timeout: 10000,
});

cmsAxios.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
