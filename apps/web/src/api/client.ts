import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? "/";
const baseURL =
  configuredBaseUrl.endsWith("/api")
    ? configuredBaseUrl.slice(0, -4) || "/"
    : configuredBaseUrl;

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});
