import api from './axios';

export const attendanceAPI = {
  getAll: (params = {}) => api.get('/attendance', { params }),
  getTodayStatus: () => api.get('/attendance/today-status'),
  checkIn: () => api.post('/attendance/check-in'),
  checkOut: () => api.post('/attendance/check-out'),
};
