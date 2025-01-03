import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const googleLogin = () => {
  window.location.href = 'http://localhost:5000/api/v1/auth/login/google';
 };

export default api;
