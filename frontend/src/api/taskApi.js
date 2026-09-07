import api from './axiosClient';

export const taskApi = {
    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    getAssignedTasks: async () => {
        const response = await api.get('/tasks/assigned');
        return response.data;
    },

    getCreatedTasks: async () => {
        const response = await api.get('/tasks/created');
        return response.data;
    },

    updateTaskStatus: async (taskId, status) => {
        const response = await api.put(`/tasks/${taskId}`, { status });
        return response.data;
    }
};

export default taskApi;
