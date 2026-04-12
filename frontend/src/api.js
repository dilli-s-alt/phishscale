import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000
});

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.response?.status === 502) {
    return "The frontend reached the Vite proxy, but the backend server on http://127.0.0.1:5000 is not responding. Ensure the backend is running and check its terminal for crashes.";
  }

  if (error?.response?.status === 503 || error?.response?.status === 504) {
    return "The backend API is temporarily unavailable. Make sure the backend server is running on port 5000.";
  }

  if (error?.code === "ECONNABORTED") {
    return "The backend took too long to respond. Make sure the backend server is running on port 5000.";
  }

  if (error?.message === "Network Error") {
    return "Cannot reach the backend API. Start the backend server on http://localhost:5000 and keep the frontend dev server running.";
  }

  return error?.message || fallbackMessage;
};
