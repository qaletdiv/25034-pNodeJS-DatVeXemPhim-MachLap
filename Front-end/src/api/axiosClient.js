import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_KEY,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config: originalRequest } = error;
    console.log("originalRequest", originalRequest);
    if (
      response &&
      response.status === 400 &&
      originalRequest.url !== "/api/login"
    ) {
      console.log("response -loi loi loi", response);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      // window.location.href = "/login"; // hoặc navigate
    }

    return Promise.reject(error);
  }
);
