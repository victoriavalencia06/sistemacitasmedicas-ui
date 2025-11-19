import axios from "axios";

const api = axios.create({
  baseURL: "https://Citas9090.somee.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
