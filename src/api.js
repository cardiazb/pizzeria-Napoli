import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://hito-3-desafio-final-g65.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en las solicitudes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Token guardado en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
