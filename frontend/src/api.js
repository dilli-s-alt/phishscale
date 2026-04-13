import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Production fallback for Vercel deployment
  if (window.location.hostname.includes("vercel.app") || window.location.hostname.includes("projects.vercel.app")) {
    return "https://phishscale-n2li.onrender.com";
  }
  return ""; 
};

export const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000
});

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.response?.status === 502) {
    return `The frontend reached the proxy, but the backend server is not responding. Ensure the backend is running at ${API.defaults.baseURL}.`;
  }

  if (error?.response?.status === 503 || error?.response?.status === 504) {
    return "The backend API is temporarily unavailable. Check your backend deployment status.";
  }

  if (error?.code === "ECONNABORTED") {
    return "The backend took too long to respond. This can happen if the database is cold-starting.";
  }

  if (error?.message === "Network Error") {
    return `Cannot reach the backend API. Ensure the backend server is running and accessible at ${API.defaults.baseURL}.`;
  }

  return error?.message || fallbackMessage;
};
