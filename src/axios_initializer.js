import axios from "axios";
import { SERVICE_URL, AUTH_TOKEN } from "./utils/Constants";

const axiosInitializer = {
  config: () => {
    axios.defaults.baseURL = SERVICE_URL;
    axios.defaults.headers.common["Authorization"] = AUTH_TOKEN
      ? `Bearer ${AUTH_TOKEN}`
      : "";
    //Request Interceptor
    axios.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    //Response Interceptor
    axios.interceptors.response.use(
      response => {
        if (response.data && response.data.message) {
        }
        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
};

export default axiosInitializer;
