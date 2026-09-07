import axiosClient from './axiosClient';

export const notificationsApi = {
  getNotifications: async () => {
    const response = await axiosClient.get('/notifications');
    return response.data;
  },
  markRead: async (id) => {
    const response = await axiosClient.post(`/notifications/${id}/read`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await axiosClient.post('/notifications/read-all');
    return response.data;
  },
  sendReminder: async (userId, message) => {
    const response = await axiosClient.post('/notifications/send-reminder', {
      user_id: userId,
      message
    });
    return response.data;
  },
  getActivityLogs: async () => {
    const response = await axiosClient.get('/notifications/activity-logs');
    return response.data;
  }
};
