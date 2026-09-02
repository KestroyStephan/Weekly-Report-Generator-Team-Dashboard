import axiosClient from './axiosClient';

export const usersApi = {
  getUsers: async () => {
    const response = await axiosClient.get('/users');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await axiosClient.patch(`/users/${id}/role`, { role });
    return response.data;
  }
};
