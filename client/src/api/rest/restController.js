import http from '../interceptor';

export const signupModelRequest = data =>
  http.post('api/auth/signup/model', data);
export const signupAgencyRequest = data =>
  http.post('api/auth/signup/agency', data);

export const loginRequest = data => http.post('api/auth/login', data);
export const logoutRequest = () => http.get('api/auth/logout');
