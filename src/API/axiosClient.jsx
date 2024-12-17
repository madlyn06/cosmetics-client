import axios from "axios";
import queryString from "query-string";

// http://localhost:8000
const env = "prod";
const baseURL =
  env === "dev" ? "http://localhost:8000" : "https://cosmetics-be.onrender.com";
const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  paramsSerializer: (params) => queryString.stringify(params)
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;
