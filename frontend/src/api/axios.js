import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_URL}/api`,
  withCredentials: true,
});

// Add a response interceptor to handle expired sessions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 (Unauthorized), the cookie is likely gone/expired
    if (error.response && error.response.status === 401) {
      // We don't need to manually clear storage anymore,
      // just push the user to login.
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
