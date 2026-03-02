import axios from "axios";

const API = axios.create({ baseURL: `${import.meta.env.VITE_APP_URL}/api` });

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Grab the status and the current URL
    const status = error.response ? error.response.status : null;
    const isLoginRequest = error.config.url.includes("/auth/login");

    // 2. Only redirect if it's a 401 AND we aren't already trying to login
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      // Use window.location only as a last resort for global auth failures
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
