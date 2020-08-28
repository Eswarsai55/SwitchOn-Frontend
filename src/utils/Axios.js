import axios from "axios";
import { baseUrl } from "./Environment";
import { getToken } from "./ManageToken";

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

const AuthenticatedAxios = () => {
  const axiosInstance = Object.assign({}, instance);

  axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization = getToken();
    return config;
  });
  
  axiosInstance.interceptors.response.use(undefined, (error) => {
      if (error.response.status === 401) {
          window.location = "/login";
      }
      return Promise.reject(error);
  });

  return axiosInstance;
}

export default {
  SERVER: instance,
  AUTH_SERVER: AuthenticatedAxios(),
};