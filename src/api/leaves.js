import api from './axios';

export const leavesAPI = {
  getAll: (params = {}) => api.get('/leaves', { params }),
  getBalance: () => api.get('/leaves/balance'),
  create: (data) => api.post('/leaves', data),
  updateStatus: (id, status) => api.put(`/leaves/${id}/status`, { status }),
  remove: (id) => api.delete(`/leaves/${id}`),
};
