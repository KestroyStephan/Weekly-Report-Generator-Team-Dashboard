import axiosClient from './axiosClient';

export const usersApi = {
  getUsers: async () => {
    const response = await axiosClient.get('/users');
    return response.data;
  },
  getRoles: async () => {
    const response = await axiosClient.get('/users/roles');
    return response.data;
  },
  createUser: async (userData) => {
    const response = await axiosClient.post('/users', userData);
    return response.data;
  },
  getUserById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await axiosClient.patch(`/users/${id}/role`, { role });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  }
};
