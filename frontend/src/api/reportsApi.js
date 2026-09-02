import axiosClient from './axiosClient';

export const reportsApi = {
  getReports: async (params = {}) => {
    const response = await axiosClient.get('/reports', { params });
    return response.data;
  },
  getReportById: async (id) => {
    const response = await axiosClient.get(`/reports/${id}`);
    return response.data;
  },
  createReport: async (reportData) => {
    const response = await axiosClient.post('/reports', reportData);
    return response.data;
  },
  updateReport: async (id, updateData) => {
    const response = await axiosClient.put(`/reports/${id}`, updateData);
    return response.data;
  },
  submitReport: async (id) => {
    const response = await axiosClient.post(`/reports/${id}/submit`);
    return response.data;
  },
  getReportVersions: async (id) => {
    const response = await axiosClient.get(`/reports/${id}/versions`);
    return response.data;
  },
  reviewReport: async (id, reviewData) => {
    const response = await axiosClient.post(`/reports/${id}/review`, reviewData);
    return response.data;
  }
};
