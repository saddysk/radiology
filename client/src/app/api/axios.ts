import axios from "axios";

export const globalAxios = axios.create({
  baseURL: process.env["NEXT_PUBLIC_API_BASE"],
  // withCredentials: true,
  // headers: {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/json',
  // },
});

globalAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("x-session-token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
