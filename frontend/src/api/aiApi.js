import axiosClient from './axiosClient';

export const aiApi = {
  chat: async (question, week_start_date = null) => {
    const response = await axiosClient.post('/ai/chat', { question, week_start_date });
    return response.data;
  }
};
