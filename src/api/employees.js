import api from "./axios";

export const employeesAPI = {
  getAll: (params = {}) => api.get("/employees", { params }),
  getOne: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data, { timeout: 120000 }),
  update: (id, data) => api.put(`/employees/${id}`, data),
  remove: (id) => api.delete(`/employees/${id}`),
  sendSetupLink: (data) =>
    api.post("/employees/send-setup-link", data, { timeout: 120000 }),
};
