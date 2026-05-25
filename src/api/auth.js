import api from './axios';

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  sendOtp: (data) => api.post('/auth/sendotp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  createPassword: (data) => api.post('/auth/create-password', data),
  register: (data) => api.post('/auth/register', data),
};
