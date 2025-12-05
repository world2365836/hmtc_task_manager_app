import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const taskService = {
  createTask: async (taskData) => {
    const response = await axios.post(`${API_BASE_URL}/addtask`, taskData);
    return response.data;
  }

};