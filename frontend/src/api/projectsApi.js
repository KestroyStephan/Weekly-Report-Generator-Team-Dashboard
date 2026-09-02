import axiosClient from './axiosClient';

export const projectsApi = {
  getProjects: async () => {
    const response = await axiosClient.get('/projects');
    return response.data;
  },
  createProject: async (projectData) => {
    const response = await axiosClient.post('/projects', projectData);
    return response.data;
  },
  updateProject: async (id, projectData) => {
    const response = await axiosClient.put(`/projects/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
  }
};
