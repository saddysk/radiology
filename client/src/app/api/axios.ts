import axios from "axios";

export const globalAxios = axios.create({
  baseURL: process.env["NEXT_PUBLIC_API_BASE"],
  headers: {
    // Global defaults
  },
});
