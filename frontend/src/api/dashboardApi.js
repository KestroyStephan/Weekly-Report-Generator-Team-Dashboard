import axiosClient from './axiosClient';

export const dashboardApi = {
  getSummary: async () => {
    const response = await axiosClient.get('/dashboard/summary');
    return response.data;
  },
  getTasksTrend: async () => {
    const response = await axiosClient.get('/dashboard/charts/tasks-trend');
    return response.data;
  },
  getStatusByMember: async () => {
    const response = await axiosClient.get('/dashboard/charts/status-by-member');
    return response.data;
  },
  getWorkloadByProject: async () => {
    const response = await axiosClient.get('/dashboard/charts/workload-by-project');
    return response.data;
  },
  getHoursByType: async () => {
    const response = await axiosClient.get('/dashboard/charts/hours-by-type');
    return response.data;
  },
  getActivityFeed: async () => {
    const response = await axiosClient.get('/dashboard/activity-feed');
    return response.data;
  }
};
