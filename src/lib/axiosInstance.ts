
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: '/', 
});

// Check if running in a browser environment before setting up the interceptor
if (typeof window !== 'undefined') {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('user-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
