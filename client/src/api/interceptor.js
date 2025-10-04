import axios from 'axios';
import CONTANTS from '../utils/constants';
import history from '../browserHistory';

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
    if (response.data?.token) {
      window.localStorage.setItem(CONTANTS.ACCESS_TOKEN, response.data.token);
    }
    return response;
  },
  err => {
    const status = err.response?.status;

    if ([401, 403].includes(status)) {
      window.localStorage.removeItem(CONTANTS.ACCESS_TOKEN);
      if (!['/login', '/signup', '/'].includes(history.location.pathname)) {
        history.replace('/login');
      }
    }

    if (status === 408) {
      if (!['/login', '/signup', '/'].includes(history.location.pathname)) {
        history.replace('/login');
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
