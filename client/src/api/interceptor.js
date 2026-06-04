import axios from 'axios';
import CONTANTS from '../utils/constants';

const instance = axios.create({
  baseURL: CONTANTS.BASE_URL,
});

instance.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem(CONTANTS.ACCESS_TOKEN);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  err => Promise.reject(err)
);

instance.interceptors.response.use(
  response => {
    if (response.data?.accessToken) {
      window.localStorage.setItem(
        CONTANTS.ACCESS_TOKEN,
        response.data.accessToken
      );
    }

    return response;
  },
  err => {
    const status = err.response?.status;

    if (status === 401) {
      window.localStorage.removeItem(CONTANTS.ACCESS_TOKEN);

      const currentPath = window.location.pathname;
      const safePaths = ['/login', '/signup', '/'];

      if (!safePaths.includes(currentPath)) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
